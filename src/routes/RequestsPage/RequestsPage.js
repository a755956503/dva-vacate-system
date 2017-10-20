import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Table, Icon, Popover } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './RequestsPage.css';
const { Header, Content, Footer } = Layout;
function mapStateToProps(state) {
  return {
    auth: state.auth.userInfo,
    requestsList: state.apply.requestsList,
  };
}

export class RequestsPage extends Component {
  componentWillMount() {
    const { auth, dispatch } = this.props;
    dispatch({ type: 'apply/getRequests', payload: { id: auth.id } });
  }
  showColumns = (goDetail, handleCancel, type) => {
    const columns = [{
      title: <p className={styles.table_title}>请假类型</p>,
      dataIndex: 'kind',
      key: 'kind',
      render(text) {
        return <p className={styles.table_columns}><strong>{text}</strong></p>;
      },
    }, {
      title: <p className={styles.table_title}>时间(from - to)</p>,
      key: 'dates',
      render(text, record) {
        return <p className={styles.table_columns}>{moment(record.from).format('DD/MM/YYYY') + ' - ' + moment(record.to).format('DD/MM/YYYY')}</p>;
      },
    }, {
      title: <p className={styles.table_title}>时长</p>,
      dataIndex: 'requested',
      key: 'requested',
      render(text) {
        return <p className={styles.table_columns}>{text}</p>
      },
    }, {
      title: <p className={styles.table_title}>状态</p>,
      dataIndex: 'status',
      key: 'status',
      render(text){
        return <p className={styles.table_columns}>{text}</p>
      },
    }, {
      title: <p className={styles.table_title}>操作</p>,
      key: 'operation',
      render(text) {
        return (
          <span>
            <span
              className={styles.icon_detail}
              onClick={e => goDetail(e, text)}
            >
              <Popover content="查看详情" trigger="hover">
                <Icon type="info-circle-o" />
              </Popover>
            </span>
            { type === 'doing' ? <span
              className={styles.icon_detail}
              onClick={() => handleCancel(text)}
            >
              <Popover content="点击取消" trigger="hover">
                <Icon type="close-circle-o" />
              </Popover>
            </span> : null
            }
          </span>
        );
      },
    }];
    return columns;
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
      pathname: '/index/detail/request/' + text.id,
      data: text,
    }));
  }
  handleCancel = (text) => {
    const { dispatch, auth } = this.props;
    dispatch({
      type: 'apply/applyCancel',
      payload: { requestId: text.id, kind: text.kind, id: auth.id },
    });
  }
  render() {
    const { match } = this.props;
    const type = match.params.type;
    const dataS = this.dataSource(this.props.requestsList, type);
    return (
      <div className={styles.container}>
        <Table
          className={styles.table}
          rowKey={record => record.id}
          columns={this.showColumns(this.goDetail, this.handleCancel, type)}
          dataSource={dataS}
        />
      </div>
    );
  }
}
export default connect(mapStateToProps)(RequestsPage);
