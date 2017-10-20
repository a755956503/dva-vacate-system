import dva from 'dva';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.css';

moment.locale('zh-cn');


// 1. Initialize
const app = dva();

app.model(require('./models/auth'));

app.model(require('./models/apply'));

// 2. Plugins
// app.use({});
app.use(createLoading({ effects: true }));

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
