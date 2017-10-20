import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, DatePicker, Form, Input, Button, message,
  Row, Col, Select, Progress, TimePicker, Calendar } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './ApplyPage.css';

const { Header, Content, Footer } = Layout;

const FormItem = Form.Item;
const Option = Select.Option;

const { MonthPicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const { TextArea } = Input;


function mapStateToProps(state) {
  return {
    userInfo: state.auth.userInfo,
    leave_left: state.apply.leave_left,
    requestsList: state.apply.requestsList,
  };
}

export class ApplyPage extends Component {
  state = {
    from: moment(new Date(), dateFormat),
    fromTime: moment(new Date(), 'HH:mm:ss'),
    to: '',
    requested: null,
    kind: 'annual',
    reason: '',
    substitute: '',
  }
  componentWillMount() {
    const { userInfo, dispatch } = this.props;
    dispatch({ type: 'apply/getRequests', payload: { id: userInfo.id } });
  }
  dateCellRender = (value) => {
    const types = {
      annual: { type: '年假', background: 'rgb(81, 112, 150)' },
      personal_affairs: { type: '事假', background: 'rgb(52, 154, 131)' },
      compensatory: { type: '调休', background: 'rgb(119, 211, 235)' },
    };
    const now = moment();
    const isNew = now.min(value) === now;
    // const isNew = true;
    let kind = null;
    const { requestsList } = this.props;
    for (const item of requestsList) {
      const from = moment(item.from).hour(0).minute(0).second(0);
      const to = moment(item.to).hour(23).minute(59).second(59);
      if (moment.min(from, value) === from && moment.max(to, value) === to) {
        if (value.day() !== 6 && value.day() !== 0 && item.status !== 'cancelled' && item.status !== 'rejected') {
          kind = item.kind;
          break;
        }
      }
    }
    return (
      <div className={isNew ? styles.events : styles.events_past}>
        <div className={styles.events_time}>{value.date()}</div>
        {kind ? <div className={styles.events_main} style={{ background: types[kind].background }}>
          {types[kind].type}
        </div> : null
        }
      </div>
    );
  }
  /*
  *年假事假半天差距12小时。
  *调休和天没关系
  */
  renderSubmit = (e) => {
    e.preventDefault();
    const { userInfo, dispatch } = this.props;
    const { fromTime, requested, kind, reason, substitute } = this.state;
    const { from } = this.state;
    let to;
    if (!requested) {
      message.error('必须输入请假时间');
      return;
    }
    const date = from.hour(fromTime.hour()).minute(fromTime.minute()).second(fromTime.second());
    const old = moment(date);
    if (kind === 'compensatory') {
      const data = requested.split('.');
      if (data[1] && data[1] !== '5') {
        message.error('调休0.5小时为单位');
        return;
      }
      to = date.add(requested, 'h');
    } else {
      const data = requested.split('.');
      if (data[1] && data[1] !== '5') {
        message.error('请假0.5天为单位');
        return;
      }
      to = date.add(requested, 'd');
    }
    const applyInfo = {
      from: old,
      to,
      id: userInfo.id,
      reason,
      kind,
      substitute,
    };
    dispatch({ type: 'apply/applyRequest', payload: { userInfo: applyInfo } });
  };

  render() {
    return (
      <div>
        <div className={styles.main_left}>
          <div className={styles.main_top}>
            <Calendar
              dateFullCellRender={this.dateCellRender}
              fullscreen={false}
            />
          </div>
        </div>
        <div className={styles.main_right}>
          <Form horizontal onSubmit={e => this.renderSubmit(e)}>
            <FormItem label="开始日期：">
              <DatePicker
                defaultValue={moment(new Date(), dateFormat)}
                format={dateFormat}
                value={this.state.from}
                onChange={data => this.setState({
                  from: data,
                })}
              />
            </FormItem>
            <FormItem label="开始时间：">
              <TimePicker
                defaultValue={moment(new Date(), 'HH:mm:ss')}
                value={this.state.fromTime}
                onChange={data => this.setState({
                  fromTime: data,
                })}
              />
            </FormItem>
            <FormItem label="请假类型：">
              <Select
                defaultValue=""
                value={this.state.kind}
                onSelect={data => this.setState({
                  kind: data,
                })}
              >
                <Option value="annual">年假</Option>
                <Option value="personal_affairs">事假</Option>
                <Option value="compensatory">调休</Option>
              </Select>
            </FormItem>
            <FormItem label="请假时间：">
              <Input
                placeholder="年假最小0.5天，调休最小0.5小时"
                value={this.state.requested}
                onChange={e => this.setState({
                  requested: e.target.value,
                })}
                addonAfter={this.state.kind === 'compensatory' ? '小时' : '天'}
              />
            </FormItem>
            <FormItem label="接替人：">
              <Input
                value={this.state.substitute}
                onChange={e => this.setState({
                  substitute: e.target.value,
                })}
              />
            </FormItem>
            <FormItem label="请假原因：">
              <TextArea
                placeholder="请输入您的请假原因"
                autosize={{ minRows: 2, maxRows: 6 }}
                value={this.state.reason}
                onChange={e => this.setState({
                  reason: e.target.value,
                })}
              />
              <div style={{ margin: '24px 0' }} />
            </FormItem>
            <Row>
              <Col span="2" offset="11">
                <Button type="primary" size="large" htmlType="submit">提交</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}


export default connect(mapStateToProps)(ApplyPage);
