import {
  Checkbox,
  DatePicker,
  Input,
  Radio,
  Select,
  Switch,
  TimePicker,
} from 'antd';

export default function SettingItem(props) {
  const { value, onChange, type, ...otherProps } = props;

  switch (type) {
    case 'input':
      return <Input value={value} onChange={onChange} {...otherProps} />;
    case 'select':
      return <Select value={value} onChange={onChange} {...otherProps} />;
    case 'radio':
      return <Radio.Group value={value} onChange={onChange} {...otherProps} />;
    case 'checkbox':
      return (
        <Checkbox.Group value={value} onChange={onChange} {...otherProps} />
      );
    case 'date':
      return <DatePicker value={value} onChange={onChange} {...otherProps} />;
    case 'time':
      return <TimePicker value={value} onChange={onChange} {...otherProps} />;
    case 'switch':
    default:
      return <Switch checked={value} onChange={onChange} {...otherProps} />;
  }
}
