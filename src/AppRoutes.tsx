import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Strings from "./utils/strings";
import SignInPage from "./SigninPage";
import SignUpPage from "./SignUpPage";
import VerifyEmailPage from "./VerifyEmailPage";
import ResetPasswordPage from "./ResetPasswordPage";
import OverviewPage from "./OverviewPage";
import ZoomInPage from "./ZoomInPage";
import AddTickerPage from "./AddTickerPage";

function AppRoutes () {
    return (
        <Router>
            <Routes>
                <Route path={Strings.initialRoute} element={<SignInPage />} />
                <Route path={Strings.signUpRoute} element={<SignUpPage />} />
                <Route path={Strings.verifyEmailRoute} element={<VerifyEmailPage />} />
                <Route path={Strings.resetPassowrdRoute} element={<ResetPasswordPage />} />
                <Route path={Strings.overViewRoute} element={<OverviewPage />} />
                <Route path={Strings.zoominRoute} element={<ZoomInPage />} />
                <Route path={Strings.addTickerRoute} element={<AddTickerPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;