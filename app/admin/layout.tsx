import AdminNav from "../components/admin/AdminNav";

export const metadata = {
    title: 'GT- ADMIN',
    description: 'Trang chủ ADMIN GT-Shop'

}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AdminNav />
            {children}
        </div>
    );
}

export default AdminLayout;