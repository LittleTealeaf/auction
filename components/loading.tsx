import { CircularProgress } from "@mui/material";
import {CSSProperties, FC } from "react";
import css from "styles/components/loadingbutton.module.scss";

const LoadingElement: FC<{
    component: JSX.Element;
    active: boolean;
    size?: number;
    style?: CSSProperties
}> = ({ component, active: loading, size, style }) => {
    return (
        <div className={css.container} style={style}>
            <div>{component}</div>
            {loading && (
                <CircularProgress
                    size={size || 24}
                    className={css.progress}
                    style={{
                        marginLeft: (size || 24) / -2,
                        marginTop: (size || 24) / -2,
                    }}
                />
            )}
        </div>
    );
};

export default LoadingElement;
