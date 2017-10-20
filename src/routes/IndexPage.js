import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Switch } from 'dva/router';
import { Layout, Menu, message, Icon, Popover } from 'antd';
import { routerRedux, Redirect } from 'dva/router';
import styles from './IndexPage.css';
import logo from '../assets/logo.png';
import ApplyPage from './ApplyPage/ApplyPage';
import RequestsPage from './RequestsPage/RequestsPage';
import ApprovalPage from './ApprovalPage/ApprovalPage';
import DetailPage from './DetailPage/DetailPage';

const { Header, Content, Footer, Sider } = Layout;

function mapStateToProps(state) {
  return {
    auth: state.auth,
    userInfo: state.auth.userInfo,
    modelInfo: state.apply.modelInfo,
  };
}

export class IndexPage extends Component {
  state = {
    inlineHeight: 0,
    key: 'apply',
  };
  componentWillMount() {
    const { dispatch, auth } = this.props;
    const { isLogin } = auth;
    if (!isLogin) {
      dispatch(routerRedux.push('/login'));
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.renderMenu);
    this.renderMenu();
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch, auth } = nextProps;
    const { isLogin } = auth;
    if (!isLogin) {
      dispatch(routerRedux.push('/login'));
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.renderMenu);
  }
  // 通过路由进行tab之间的切换。
  // item = {key: "/apply", keyPath: Array(1), item: {…}, domEvent:s Proxy},
  handleClick = (item) => {
    const { dispatch } = this.props;
    const key = item.key.split('/');
    this.setState({
      key: key[2],
    });
    dispatch(routerRedux.push(item.key));
  }
  handleUser = (e) => {
    e.preventDefault();
  }
  handleLogout = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'auth/logout',
    });
  }
  handleToggle = (e) => {
    const { inlineHeight } = this.state;
    if (inlineHeight === 0) {
      this.setState({
        inlineHeight: 'auto',
      });
    } else {
      this.setState({
        inlineHeight: 0,
      });
    }
  }
  renderMenu = () => {
    const screen = window.innerWidth;
    if (screen > 800) {
      this.setState({
        screen: true,
      });
    } else {
      this.setState({
        screen: false,
      });
    }
  }
  render() {
    const { modelInfo, dispatch, userInfo } = this.props;
    const { inlineHeight, key } = this.state;
    if (modelInfo) {
      message.info(modelInfo);
      dispatch({ type: 'apply/clearMessage' });
    }
    const cover = mode => (<Menu
      mode={mode}
      style={{ height: mode === 'inline' ? inlineHeight : 'auto' }}
      onClick={this.handleClick}
      defaultSelectedKeys={['/index/apply']}
      className={mode === 'inline' ? styles.menu_style_inline : styles.menu_style}
    >
      <Menu.Item key="/index/apply"><span
        style={{ color: key === 'apply' ? 'rgb(196, 43, 37)' : '#fff' }}
        className={styles.top_menu}
      ><Icon type="edit" />申请请假</span></Menu.Item>
      <Menu.SubMenu
        title={<span
          className={styles.top_menu}
          style={{ color: key === 'requests' ? 'rgb(196, 43, 37)' : '#fff' }}
        ><Icon type="file-text" />请假记录</span>} key="requests"
      >
        <Menu.Item key="/index/requests/done">
          <p className={styles.submenu_style}>
            <Icon type="check-square-o" />已完成
          </p>
        </Menu.Item>
        <Menu.Item key="/index/requests/doing">
          <p className={styles.submenu_style}>
            <Icon type="clock-circle-o" />流程中
          </p>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        title={<span
          className={styles.top_menu}
          style={{ color: key === 'approval' ? 'rgb(196, 43, 37)' : '#fff' }}
        ><Icon type="solution" />审批记录</span>} key="approval"
      >
        <Menu.Item key="/index/approval/done">
          <p className={styles.submenu_style}>
            <Icon type="check-circle-o" />已审批
          </p>
        </Menu.Item>
        <Menu.Item key="/index/approval/doing">
          <p className={styles.submenu_style}>
            <Icon type="exclamation-circle-o" />未审批
          </p>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>)
    const logoback = (
      <div className={styles.logo_back} onClick={this.handleLogout}>
        <Icon type="logout" />
      </div>
    );
    const logouser = (
      <div className={styles.logo_back} onClick={this.handleUser}>
        <Popover placement="bottom" content={userInfo.name} trigger="hover">
          <Icon type="smile-o" />
        </Popover>
      </div>
    )
    const left = (<Header
      className={styles.header_style}
    >
      <div>
        <img
          src={logo} alt="logo"
          className={styles.logo}
          onClick={this.handleToggle}
        />
        {cover('inline')}
        {logoback}
        {logouser}
      </div>
    </Header>);
    const top = (<Header
      className={styles.header_style}
    >
      <div>
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      {cover('horizontal')}
      {logoback}
      {logouser}
    </Header>);
    return (
      <Layout className={styles.normal}>
        {this.state.screen ? top : left}
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Switch>
            <Route path="/index/apply" component={ApplyPage} />
            <Redirect from="/index" exact to="/index/apply" />
            <Route path="/index/approval/:type" component={ApprovalPage} />
            <Route path="/index/requests/:type" component={RequestsPage} />
            <Route path="/index/detail/:type/:id" component={DetailPage} />
          </Switch>
        </Content>
      </Layout>
    );
  }
}


export default connect(mapStateToProps)(IndexPage);
