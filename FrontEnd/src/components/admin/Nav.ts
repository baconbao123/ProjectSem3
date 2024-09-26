import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
const MenuTopBar = [
    {link: '/admin', title: 'Administration', icon: BadgeIcon, code: 'admin'},
    {link: '/home', title: 'Home Page', icon: HomeIcon, code: 'home'},
]

const MenuSideBar = [
    {link: '/user', title: 'User', icon: PersonOutlineOutlinedIcon,  code: 'user'},
    {link: '/resource', title: 'Resource', icon: CollectionsBookmarkOutlinedIcon,  code: 'resource'},
    {link: '/role', title: 'Role', icon: AddModeratorOutlinedIcon,  code: 'role'},
    {link: '/permission', title: 'Permission', icon: ShieldOutlinedIcon,  code: 'permission'},
    {link: '/category', title: 'Category', icon: ClassOutlinedIcon,  code: 'category'},
    {link: '/author', title: 'Author', icon: RecentActorsOutlinedIcon,  code: 'author'},
    // {link: '/admin/about', title: 'About', icon: BadgeIcon,  code: 'admin2'},
    // {link: '/admin/product', title: 'Product', icon: BadgeIcon, code: 'admin3'},
    // {link: '/admin/stock', title: 'Stock', icon: WarehouseOutlinedIcon,  code: 'admin4'},
    // {link: '/admin/setting', title: 'Setting', icon: SettingsOutlinedIcon,  code: 'admin5'},
]

export  {
    MenuTopBar, MenuSideBar
}