import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { MdFacebook } from 'react-icons/md';
import { AiFillTwitterCircle, AiFillInstagram, AiFillYoutube } from 'react-icons/ai';

const Footer = () => {
    return <footer className="bg-slate-700 
    text-slate-200 text-sm mt-16">
        <Container>
            <div className="flex flex-col md:flex-row
            justify-between pt-16 pb-8">
                <FooterList>
                    <h3 className="text-base font-bold mb-2">Shop Categories</h3>
                    <Link href="#">Phones</Link>
                    <Link href="#">Laptops</Link>
                    <Link href="#">Desktops</Link>
                    <Link href="#">Watches</Link>
                    <Link href="#">TVs</Link>
                    <Link href="#">Accessories</Link>
                </FooterList>

                <FooterList>
                    <h3 className="text-base font-bold mb-2">Customer Service</h3>
                    <Link href="#">Contact Us</Link>
                    <Link href="#">Shipping Policy</Link>
                    <Link href="#">Returns & Exchanges</Link>
                    <Link href="#">Watches</Link>
                    <Link href="#">FAQs</Link>
                </FooterList>
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                    <h3 className="text-base font-bold mb-2">About Us</h3>
                    <p className="mb-2">May Anh Giang Tuan là gian hàng trực tuyến (mua hàng online). Với mong muốn mang lại sự tiện lợi, lựa chọn đa dạng hơn và các dịch vụ tốt hơn cho người tiêu dùng. Sản phẩm chủ lực của e-shop là hàng bảo hộ lao động ; vật tư , công cụ, thiết bị cho công nghiệp và dân dụng ; thực phẩm nhập khẩu từ hàn quốc và văn phòng phẩm.</p>
                    <p>&copy; {new Date().getFullYear()} May Anh Giang Tuan. All Rights reserved</p>
                </div>

                <FooterList>
                    <h3 className="text-base font-bold mb-2">Follow Us</h3>
                    <div className="flex gap-2">
                        <Link href="#">
                            <MdFacebook size={24} />
                        </Link>
                        <Link href="#">
                            <AiFillTwitterCircle size={24} />
                        </Link>
                        <Link href="#">
                            <AiFillInstagram size={24} />
                        </Link>
                        <Link href="#">
                            <AiFillYoutube size={24} />
                        </Link>
                    </div>
                </FooterList>

            </div>
        </Container>
    </footer>;
};

export default Footer;