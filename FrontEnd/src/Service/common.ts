
const checkPermission = (resource: any, action: any) => {
    if (localStorage.getItem('id') === '1' ) {
        return true
    }
    let permisions = localStorage.getItem('permission');
    if (!permisions) {
        return false;
    }
    permisions = JSON.parse(permisions);
    // @ts-ignore
    const check = permisions.filter( item => resource === item.resource_name && item.action_name === action);
    return check.length > 0;
}


export { checkPermission }