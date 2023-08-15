import { Outlet} from "react-router-dom";

import Nav from '@/components/layouts/Nav'
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster"
import { useBoundStore } from "@/store";

import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('My-Logger');

const listener = (data: any) => {
  switch (data?.payload?.event) {
    case 'configured':
		logger.info('the Auth module is configured');
		break;
    case 'signIn':
      	console.log('user has sign in')
		console.log(data?.payload.data.username)
		// set user details in localstorage
		useBoundStore.getState().updateProfile({
			userName: data.payload.data.username,
			isLoggedIn: true
		})
      	break;
    case 'signIn_failure':
		logger.error('user sign in failed');
		break;
    case 'signUp':
		logger.info('user signed up');
		break;
    case 'signUp_failure':
		logger.error('user sign up failed');
		break;
    case 'confirmSignUp':
		logger.info('user confirmation successful');
		break;
    case 'completeNewPassword_failure':
		logger.error('user did not complete new password flow');
		break;
    case 'autoSignIn':
		console.log('auto sign in successful');
		break;
    case 'autoSignIn_failure':
		logger.error('auto sign in failed');
		break;
    case 'forgotPassword':
		logger.info('password recovery initiated');
		break;
    case 'forgotPassword_failure':
		logger.error('password recovery failed');
		break;
    case 'forgotPasswordSubmit':
		logger.info('password confirmation successful');
		break;
    case 'forgotPasswordSubmit_failure':
		logger.error('password confirmation failed');
		break;
    case 'verify':
		logger.info('TOTP token verification successful');
		break;
    case 'tokenRefresh':
		logger.info('token refresh succeeded');
		break;
    case 'tokenRefresh_failure':
		logger.error('token refresh failed');
		break;
    case 'cognitoHostedUI':
		logger.info('Cognito Hosted UI sign in successful');
		break;
    case 'cognitoHostedUI_failure':
		logger.error('Cognito Hosted UI sign in failed');
		break;
    case 'customOAuthState':
		logger.info('custom state returned from CognitoHosted UI');
		break;
    case 'customState_failure':
		logger.error('custom state failure');
		break;
    case 'parsingCallbackUrl':
		logger.info('Cognito Hosted UI OAuth url parsing initiated');
		break;
    case 'userDeleted':
		logger.info('user deletion successful');
		break;
    case 'updateUserAttributes':
		logger.info('user attributes update successful');
		break;
    case 'updateUserAttributes_failure':
		logger.info('user attributes update failed');
		break;
    case 'signOut':
		logger.info('user signed out');
		break;
    default:
		logger.info('unknown event type');
		break;
  }
};

Hub.listen('auth', listener);

export default function Root() {
    return (
      <>
        <Nav />
        <main className="sm:w-3/4 max-lg:px-4 items-center w-full m-auto pt-24 sm:pt-28 mb-10">
            <Outlet />
        </main>
        <Toaster />
        <Footer />
      </>
    );
}