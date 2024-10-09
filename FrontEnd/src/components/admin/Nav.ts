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
import BusinessIcon from '@mui/icons-material/Business';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
const MenuTopBar = [
    {link: '/admin', title: 'Administration', icon: BadgeIcon, code: 'admin'},
    {link: '/home', title: 'Home Page', icon: HomeIcon, code: 'home'},
]

const MenuSideBar = [
    {link: '/user', title: 'User', icon: PersonOutlineOutlinedIcon,  code: 'User'},
    {link: '/product', title: 'Product', icon: Inventory2OutlinedIcon  , code: 'Product'},
    {link: '/order', title: 'Order', icon: ShoppingCartCheckoutOutlinedIcon  , code: 'Order'},
    {link: '/category', title: 'Category', icon: ClassOutlinedIcon,  code: 'Category'},
    {link: '/author', title: 'Author', icon: RecentActorsOutlinedIcon,  code: 'Author'},
    {link: '/company', title: 'Company', icon: BusinessIcon,  code: 'CompanyPartner'},
    {link: '/discount', title: 'Discount', icon: DiscountOutlinedIcon  , code: 'Sale'},
    {link: '/FAQ', title: 'FAQs', icon: QuizOutlinedIcon   , code: 'FAQ'},
    {link: '/role', title: 'Role', icon: AddModeratorOutlinedIcon,  code: 'Role'},
    {link: '/permission', title: 'Permission', icon: ShieldOutlinedIcon,  code: 'Permission'},
    {link: '/resource', title: 'Resource', icon: CollectionsBookmarkOutlinedIcon,  code: 'Resource', hide: false},
]

export  {
    MenuTopBar, MenuSideBar
}