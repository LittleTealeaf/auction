import css from "./style.module.scss";
import { MakeFC } from "src/react/wrappers";

export default MakeFC(() => (
    <div className={css.root}>
        <div>
            <h3>Forbidden Access</h3>
            <p>You do not have permissions to view this page</p>
        </div>
    </div>
));
