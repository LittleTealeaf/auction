import { ClassNamesArg } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import { CSSProperties, FC } from "react";
import css from "styles/components/loadingelement.module.scss";

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
