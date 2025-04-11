import {Outlet} from "react-router-dom";

function NormalLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default NormalLayout;