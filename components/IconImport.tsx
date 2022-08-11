import { Skeleton } from "@mui/material";
import { ComponentType, FC, lazy, Suspense } from "react";

type Props = {
    factory: () => Promise<{ default: ComponentType<any> }>;
};

const IconImport: FC<Props> = ({ factory }) => {
    const Icon = lazy(factory);

    return (
        <Suspense fallback={<Skeleton variant="circular" />}>
            <Icon />
        </Suspense>
    );
};

export default IconImport;
