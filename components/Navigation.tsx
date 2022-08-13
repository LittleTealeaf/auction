import css from "styles/components/pagewrapper.module.scss";
import { AppBar, Drawer, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar } from "@mui/material";
import { FC, MouseEventHandler, useState } from "react";
import { UserData } from "types/api";
import useWindowSize from "src/hooks/useWindowSize";
import { AccountCircle, Home as HomeIcon, Logout, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon } from "@mui/icons-material";
import { fetchApi, jsonResponse, requireStatus } from "src/app/api";
import { clearSessionId } from "src/app/session";
import { MuiIcon } from "types/app";
import Link from "next/link";

const drawerWidth = 240;

type Props = {
    user: UserData;
    children: JSX.Element;
};

const PageWrapper: FC<Props> = ({ user, children }) => {
    const { width } = useWindowSize();

    const [showMobileDrawer, setShowMobileDrawer] = useState(false);

    const handleDrawerToggle = () => setShowMobileDrawer(!showMobileDrawer);

    const condenseScreen = width && width <= 800;

    const visibleDrawerWidth = condenseScreen ? 0 : drawerWidth;

    return (
        <>
            <AppBar
                color="primary"
                position="sticky"
                style={{
                    top: "0px",
                }}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar className={css.toolbar} variant="dense">
                    {condenseScreen && (
                        <IconButton color="inherit" onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <div className={css.spacer} />
                    <UserProfile user={user} />
                </Toolbar>
            </AppBar>
            <Drawer
                variant={condenseScreen ? "temporary" : "permanent"}
                open={showMobileDrawer}
                onClose={() => setShowMobileDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                }}
            >
                <Toolbar variant="dense"></Toolbar>
                <DrawerContents user={user} onAction={() => setShowMobileDrawer(false)} />
            </Drawer>
            <div
                className={css.page}
                style={{
                    marginLeft: `${visibleDrawerWidth}px`,
                    width: `calc(100vw - ${visibleDrawerWidth}px)`,
                }}
            >
                {children}
            </div>
        </>
    );
};

export const UserProfile: FC<{ user: UserData }> = ({ user }) => {
    const [anchorEl, setAnchorElement] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    const actionLogout = () => {
        fetchApi("api/auth/login", "DELETE")
            .then(requireStatus(202))
            .then(jsonResponse)
            .then((_) => {
                clearSessionId();
                location.reload();
            });
    };

    return (
        <>
            <Button
                startIcon={<AccountCircle />}
                id="userMenu"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                color="inherit"
            >
                {user.username}
            </Button>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={actionLogout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>{"Logout"}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

function buildNavItem(onAction: () => void, { icon, primary, secondary, href }: { icon?: MuiIcon; primary: string; secondary?: string; href?: string; onClick?: () => void }) {
    return (
        <ListItem disablePadding>
            <Link href={href || "/"} passHref>
                <ListItemButton onClick={onAction}>
                    {icon && <ListItemIcon>{icon}</ListItemIcon>}
                    <ListItemText primary={primary} secondary={secondary} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
}

const DrawerContents: FC<{ user: UserData; onAction: () => void }> = ({ user, onAction }) => (
    <>
        <Divider />
        <List>
            {buildNavItem(onAction, {
                icon: <HomeIcon />,
                primary: "Home",
                href: "/",
            })}
        </List>
        <Divider />
        <List>
            {user.manageUsers &&
                buildNavItem(onAction, {
                    icon: <ManageAccountsIcon />,
                    primary: "Manage Users",
                    href: "/users",
                })}
        </List>
    </>
);

export default PageWrapper;
