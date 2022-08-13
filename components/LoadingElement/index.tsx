import css from "./style.module.scss";
import { ClassNamesArg } from "@emotion/react";
import { CSSProperties, FC, lazy, Suspense } from "react";

const CircularProgress = lazy(() => import("@mui/material/CircularProgress"));

const LoadingElement: FC<{
    children?: JSX.Element | never[] | never;
    active: boolean;
    size?: number;
    style?: CSSProperties;
    className?: ClassNamesArg;
}> = ({ children, active: loading, size, style, className }) => {
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
};

export default LoadingElement;
