import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
export const SidebarData = [
    {
        title: "Dashboard",
        icon: <HomeIcon />,
        link:  "/dashboard"
    },
    {
        title: "Library",
        icon: <MenuBookIcon />,
        link: "/library",
    },
    {
        title: "Bookmarks",
        icon: <BookmarkIcon />,
        link: "/bookmarks",
    }
]

