// 重写localeCompare
const oldLocaleCompare = String.prototype.localeCompare;
String.prototype.localeCompare = function (other) {
  if (typeof this !== 'string' || typeof other !== 'string') {
    return oldLocaleCompare.call(this, other);
  }
  const thisStr = this.replace(/\u200b/g, '');
  const otherStr = other.replace(/\u200b/g, '');
  return oldLocaleCompare.call(thisStr, otherStr);
};

// 重写includes
const oldIncludes = String.prototype.includes;
String.prototype.includes = function (other) {
  if (typeof this !== 'string' || typeof other !== 'string') {
    return oldIncludes.call(this, other);
  }
  const thisStr = this.replace(/\u200b/g, '');
  const otherStr = other.replace(/\u200b/g, '');
  return oldIncludes.call(thisStr, otherStr);
};
