import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Table, Collapse, Icon, Row, Col } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './DetailPage.css';

const { Header, Content, Footer } = Layout;
const Panel = Collapse.Panel;

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
export class DetailPage extends Component {
  componentWillMount() {
    const { dispatch, location } = this.props;
    if (!location.data) {
      dispatch(routerRedux.push('/'));
    }
  }
  historyCol = [{
    title: '操作类型',
    key: 'action',
    dataIndex: 'action',
  }, {
    title: '操作时间',
    key: 'date',
    dataIndex: 'date',
  }, {
    title: '操作人',
    key: 'person',
    dataIndex: 'person',
  }, {
    title: '附加信息',
    key: 'text',
    dataIndex: 'text',
  }];
  handleCancel = (text) => {
    const { dispatch, auth } = this.props;
    dispatch({
      type: 'apply/applyCancel',
      payload: { requestId: text.id, kind: text.kind, id: auth.id },
    });
  }
  handleUpdateStatus = (key, status) => {
    const { auth, dispatch } = this.props;
    const approvalData = {
      id: auth.id,
      op_type: status,
      request_id: key,
    };
    dispatch({
      type: 'apply/updateApproval',
      payload: {
        approvalData,
      },
    });
  }
  handleBack = (type) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  }
  renderOperation = (detail, type) => {
    const back = (<div className={styles.item} onClick={() => this.handleBack(detail)}>
      <Icon type="rollback" />返回
    </div>);
    const cancel = (<div className={styles.item} onClick={() => this.handleCancel(detail)}>
      <Icon type="close" />取消申请
    </div>);
    const approve = (<div className={styles.item} onClick={() => this.handleUpdateStatus(detail.id, 'approved')}>
      <Icon type="check" />通过
    </div>);
    const reject = (<div className={styles.item} onClick={() => this.handleUpdateStatus(detail.id, 'rejected')}>
      <Icon type="close" />拒绝
    </div>);
    const comment = <div className={styles.item}><Icon type="edit" />评论</div>;
    const download = <div className={styles.item}><Icon type="cloud-download-o" />下载</div>;
    let arr;
    if (type === 'approval') {
      arr = [back];
      if (detail.status === 'pending') {
        arr.push(approve);
        arr.push(reject);
      }
    } else {
      arr = [back];
      if (detail.status === 'pending') {
        arr.push(cancel);
      }
    }
    return (<Row style={{ textAlign: 'center' }}>
      {arr.map(item => <Col span={3}>{item}</Col>)}
    </Row>);
  }
  renderDetail = (detail) => {
    return (<div className={styles.section}>
      <p><h1 className={styles.section_title}>详情</h1></p>
      <div className={styles.section_main}>
        <table className={styles.section_table}>
          {detail.reporter ? <tr>
            <td>申请人</td>
            <td>{detail.reporter}</td>
          </tr> : null}
          <tr>
            <td>申请时间</td>
            <td>{moment(detail.from).format('DD/MM/YYYY') + ' - ' + moment(detail.to).format('DD/MM/YYYY')}</td>
          </tr>
          <tr>
            <td>申请时长</td>
            <td>{detail.requested}{detail.kind === 'compensatory' ? '小时' : '天'}</td>
          </tr>
          <tr>
            <td>类型</td>
            <td>{detail.kind}</td>
          </tr>
          <tr>
            <td>状态</td>
            <td>{detail.status}</td>
          </tr>
        </table>
      </div>
    </div>);
  }
  renderComments = (detail) => {
    return (<div className={styles.section}>
      <p><h1 className={styles.section_title}>评论</h1></p>
      <div className={styles.section_main}>
        <table className={styles.section_table}>
        </table>
      </div>
    </div>);
  }
  renderHistory = (detail) => {
    if (!detail.histories) {
      return null;
    }
    return (<div className={styles.section}>
      <p><h1 className={styles.section_title}>记录</h1></p>
      <div className={styles.section_main}>
        <Table
          dataSource={detail.histories}
          columns={this.historyCol}
          pagination={false}
        />
      </div>
    </div>);
  }
  render() {
    const { location, match } = this.props;
    const detail = location.data;
    return (
      <div>
        <div className={styles.tabs}>
          {this.renderOperation(detail, match.params.type)}
        </div>
        {this.renderDetail(detail)}
        {this.renderComments(detail)}
        {this.renderHistory(detail)}
      </div>
    );
  }
}


export default connect(mapStateToProps)(DetailPage);
