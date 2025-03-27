import { nanoid } from "nanoid";
import { DecryptError } from "./DecryptError";

/**
 * WorkerClientBus 类用于处理Web Worker客户端通信
 * 负责发送请求到Worker并处理响应
 */
export class WorkerClientBus {
  /**
   * @param {Worker} worker - Web Worker实例
   */
  constructor(worker) {
    if (!(worker instanceof Worker)) {
      throw new Error('WorkerClientBus requires a valid Worker instance');
    }
    this.worker = worker;
    this.idPromiseMap = new Map();
    
    // 处理Worker消息的事件监听器
    this.eventHandler = e => {
      const { id, result, error } = e.data;
      
      // 获取对应请求的Promise处理函数
      const actionPromise = this.idPromiseMap.get(id);
      if (!actionPromise) {
        console.error('Could not fetch worker promise for action: %s', id);
        return;
      }
      this.idPromiseMap.delete(id);

      const [resolve, reject] = actionPromise;
      if (error) {
        // 包装错误对象，保留原始错误信息
        const wrappedError = new Error(error.message, { cause: error });
        wrappedError.stack = error.stack;
        Object.assign(wrappedError, { code: error.code ?? null });
        reject(wrappedError);
      } else {
        resolve(result);
      }
    };
    
    worker.addEventListener('message', this.eventHandler);
  }

  /**
   * 向Worker发送请求并等待响应
   * @param {string} actionName - 请求的动作名称
   * @param {*} payload - 请求的数据负载
   * @returns {Promise<*>} 返回Worker处理后的结果
   */
  async request(actionName, payload) {
    if (!actionName || typeof actionName !== 'string') {
      throw new Error('Action name must be a non-empty string');
    }

    return new Promise((resolve, reject) => {
      const id = `request://${actionName}/${nanoid()}`;
      this.idPromiseMap.set(id, [resolve, reject]);
      this.worker.postMessage({
        id,
        action: actionName,
        payload,
      });
    });
  }
}

/**
 * WorkerServerBus 类用于处理Web Worker服务端通信
 * 负责接收和处理来自客户端的请求
 */
export class WorkerServerBus {
  constructor() {
    this.handlers = new Map();
    
    // 处理来自客户端的消息
    this.onmessage = async e => {
      const { id, action, payload } = e.data;
      const handler = this.handlers.get(action);

      let result = null;
      let error = null;

      if (!handler) {
        error = new Error(`Handler missing for action: ${action}`);
      } else {
        try {
          result = await handler(payload);
        } catch (err) {
          // 区分处理DecryptError和其他错误
          error = err instanceof DecryptError ? err.toJSON() : err;
        }
      }

      postMessage({ id, result, error });
    };
  }

  /**
   * 添加事件处理器
   * @param {string} actionName - 动作名称
   * @param {Function} handler - 处理函数
   */
  addEventHandler(actionName, handler) {
    if (!actionName || typeof actionName !== 'string') {
      throw new Error('Action name must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    this.handlers.set(actionName, handler);
  }
}

