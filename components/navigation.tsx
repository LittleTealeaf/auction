import { FC, MouseEventHandler, useState } from "react";
import { UserData } from "types/api";
import { MuiIcon } from "types/app";
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Logout } from "@mui/icons-material";
import css from "styles/navigation.module.scss";
import { fetchAPI } from "lib/app/fetch";

const drawerWidth = 240;

function buildNavItem({ icon, primary, secondary, href }: { icon?: MuiIcon; primary: string; secondary?: string; href?: string; onClick?: () => void }) {
    return (
        <ListItem disablePadding>
            <ListItemButton href={href || "/"}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={primary} secondary={secondary} />
            </ListItemButton>
        </ListItem>
    );
}

const Navigation: FC<{ user: UserData }> = ({ user }) => {

    const [showDrawer, setShowDrawer] = useState(false);

    const toggleDrawer = () => setShowDrawer(!showDrawer);

    const drawerContents = <DrawerContents user={user} />;



    return (
        <>
            <div>
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - ${drawerWidth}px)` },
                        ml: { md: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar className={css.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                              onClick={toggleDrawer}
                            sx={{ mr: 2, display: { md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <div className={css.spacer} />
                        <UserProfile user={user} />
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{
                        width: {
                            sm: drawerWidth,
                        },
                        flexShrink: {
                            sm: 0,
                        },
                    }}
                    aria-label="Navigation"
                >
                    <Drawer
                        variant="temporary"
                        open={showDrawer}
                        onClose={() => setShowDrawer(false)}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: "block", md: "none" },
                            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                        }}
                    >
                        {drawerContents}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", md: "block" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                    >
                        {drawerContents}
                    </Drawer>
                </Box>
            </div>
        </>
    );
};

const DrawerContents: FC<{ user: UserData }> = ({ user }) => {
    return (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {buildNavItem({
                    icon: <HomeIcon />,
                    primary: "Home",
                    href: "/",
                })}
            </List>
            <Divider />
            <List>
                {user.manageUsers &&
                    buildNavItem({
                        icon: <ManageAccountsIcon />,
                        primary: "Manage Users",
                        href: "/users",
                    })}
            </List>
        </div>
    );
};

export default Navigation;

//export const Navigation: FC<{ user: UserData }> = ({ user }) => {
//     const [showDrawer, setShowDrawer] = useState(false);
//     const toggleDrawer = () => setShowDrawer(!showDrawer);

//     return (
//         <>
//             <AppBar position="fixed">
//                 <Toolbar className={css.toolbar}>
//                     <div>Auction Manager</div>
//                     <Spacer />
//                     <UserProfile user={user} />
//                 </Toolbar>
//             </AppBar>
//             <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
//                 <List>awefawefwef</List>
//             </Drawer>
//         </>
//     );
// };

export const UserProfile: FC<{ user: UserData }> = ({ user }) => {
    const [anchorEl, setAnchorE1] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    const actionLogout = () => {
        fetchAPI("DELETE", "api/auth/login")
            .then((response) => response.json())
            .then((data) => {
                const { oldSid, message, error } = data;
                if (oldSid) {
                    document.location.href = "/";
                }
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
