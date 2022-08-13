import css from "./style.module.scss";
import { ClassNamesArg } from "@emotion/react";
import { CSSProperties, lazy, Suspense } from "react";
import { MakeFC } from "src/react/wrappers";

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));

type Props = {
    children?: JSX.Element | never[] | never;
    active: boolean;
    size?: number;
    style?: CSSProperties;
    className?: ClassNamesArg;
};

export default MakeFC<Props>(({ children, active: loading, size, style, className }) => {
    return (
        <div className={[css.container, className].join(" ")} style={style}>
            <div>{children}</div>
            {loading && (
                <Suspense>
                    <CircularProgress
                        size={size || 24}
                        className={css.progress}
                        style={{
                            marginLeft: (size || 24) / -2,
                            marginTop: (size || 24) / -2,
                        }}
                    />
                </Suspense>
            )}
        </div>
    );
});
