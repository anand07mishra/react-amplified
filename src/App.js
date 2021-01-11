import 'antd/dist/antd.css';
import './App.css';
import SiderLayout from './SiderLayout';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
Amplify.configure(awsconfig);

function App() {
  return (
    <SiderLayout />
  );
}

export default withAuthenticator(App, false);