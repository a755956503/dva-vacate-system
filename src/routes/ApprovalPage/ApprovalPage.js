import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Table, Icon, Popover } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './ApprovalPage.css';

const { Header, Content, Footer } = Layout;

function mapStateToProps(state) {
  return {
    auth: state.auth.userInfo,
    approvalsList: state.apply.approvalsList,
  };
}
export class ApprovalPage extends Component {
  componentWillMount() {
    const { auth, dispatch } = this.props;
    dispatch({ type: 'apply/getApprovals', payload: { id: auth.id } });
  }
  showColumns = (goDetail, handleUpdateStatus, type) => {
    const columns = [{
      title: <p className={styles.table_title}>申请人</p>,
      dataIndex: 'reporter',
      key: 'reporter',
      render(text) {
        return <p className={styles.table_columns}><strong>{text}</strong></p>;
      },
    }, {
      title: <p className={styles.table_title}>类型</p>,
      dataIndex: 'kind',
      key: 'kind',
      render(text) {
        return <p className={styles.table_columns}>{text}</p>
      }
    }, {
      title: <p className={styles.table_title}>开始时间</p>,
      dataIndex: 'from',
      key: 'from',
      render(text) {
        return <p className={styles.table_columns}>{moment(text).format('DD/MM/YYYY')}</p>;
      },
    }, {
      title: <p className={styles.table_title}>结束时间</p>,
      dataIndex: 'to',
      key: 'to',
      render(text) {
        return <p className={styles.table_columns}>{moment(text).format('DD/MM/YYYY')}</p>;
      },
    }, {
      title: <p className={styles.table_title}>持续时间</p>,
      dataIndex: 'requested',
      key: 'requested',
      render(text, record) {
        if (record.kind === 'compensatory') {
          return <p className={styles.table_columns}>{text + '小时'}</p>;
        } else {
          return <p className={styles.table_columns}>{text + '天'}</p>;
        }
      },
    }, {
      title: <p className={styles.table_title}>申请时间</p>,
      dataIndex: 'createDate',
      key: 'createDate',
      render(text) {
        return <p className={styles.table_columns}>{moment(text).format('DD/MM/YYYY HH:MM:SS')}</p>
      }
    }, {
      title: <p className={styles.table_title}>距离时间</p>,
      key: 'beginning',
      render(text, record) {
        return <p className={styles.table_columns}>{moment(record.from).toNow()}</p>;
      },
    }, {
      title: <p className={styles.table_title}>操作</p>,
      key: 'operation',
      render(text) {
        return (
          <span>
            <div
              className={styles.icon_detail}
              onClick={e => goDetail(e, text)}
            >
              <Popover content="查看详情" trigger="hover">
                <Icon type="info-circle-o" />
              </Popover>
            </div>
            {type === 'doing' ? <div
              className={styles.icon_detail}
              onClick={() => handleUpdateStatus(text.id, 'approved')}
            >
              <Popover content="点击通过" trigger="hover">
                <Icon type="check-circle-o" />
              </Popover>
            </div> : null }
            {type === 'doing' ? <div
              className={styles.icon_detail}
              onClick={() => handleUpdateStatus(text.id, 'rejected')}
            >
              <Popover content="点击取消" trigger="hover">
                <Icon type="close-circle-o" />
              </Popover>
            </div> : null}
          </span>
        );
      },
    }];
    return columns;
  }
  goDetail = (e, text) => {
    e.preventDefault();
    // let data = null;
    const { dispatch } = this.props;
    // for (const item of requestsList) {
    //   if (String(item.id) === String(text.id)) {
    //     data = item;
    //     break;
    //   }
    // }
    dispatch(routerRedux.push({
      pathname: '/index/detail/approval/' + text.id,
      data: text,
    }));
  }
  dataSource = (value, type) => {
    const list = value;
    const retList = [];
    let i = 0;
    while (i < list.length) {
      const obj = list[i];
      if (type === 'doing' && list[i].status === 'pending') {
        retList.push(obj);
      } else if (type === 'done' && (list[i].status !== 'pending')) {
        retList.push(obj);
      }
      i++;
    }
    return retList;
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
  render() {
    const { match } = this.props;
    const type = match.params.type;
    const dataS = this.dataSource(this.props.approvalsList, type);
    return (
      <div className={styles.container}>
        <Table
          className={styles.table}
          rowKey={record => record.id}
          columns={this.showColumns(this.goDetail, this.handleUpdateStatus, type)}
          dataSource={dataS}
        />
      </div>
    );
  }
}


export default connect(mapStateToProps)(ApprovalPage);
