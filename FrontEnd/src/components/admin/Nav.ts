import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
const MenuTopBar = [
    {link: '/admin', title: 'Administration', icon: BadgeIcon, code: 'admin'},
    {link: '/home', title: 'Home Page', icon: HomeIcon, code: 'home'},
]

const MenuSideBar = [
    {link: '/resource', title: 'Resource', icon: CollectionsBookmarkOutlinedIcon,  code: 'resource'},
    {link: '/admin/about', title: 'About', icon: BadgeIcon,  code: 'admin2'},
    {link: '/admin/product', title: 'Product', icon: BadgeIcon, code: 'admin3'},
    {link: '/admin/stock', title: 'Stock', icon: BadgeIcon,  code: 'admin4'},
    {link: '/admin/setting', title: 'Setting', icon: BadgeIcon,  code: 'admin5'},
]

export  {
    MenuTopBar, MenuSideBar
}