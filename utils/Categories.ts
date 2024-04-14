import { FaCamera, FaCameraRetro } from "react-icons/fa";
import { MdColorLens, MdStorefront } from "react-icons/md";
import { BsCameraReelsFill, BsCamera2 } from "react-icons/bs";
import { GiCctvCamera } from "react-icons/gi";

export const categories = [
    {
        label: 'All',
        icon: MdStorefront
    },
    {
        label: 'Máy Ảnh DSLR',
        icon: FaCamera
    },
    {
        label: 'Máy Ảnh Mirrerless',
        icon: FaCameraRetro
    },
    {
        label: 'Ống Kính',
        icon: MdColorLens
    },
    {
        label: 'Camera',
        icon: GiCctvCamera
    },
    {
        label: 'Máy Quay',
        icon: BsCameraReelsFill
    },
    {
        label: 'Các dòng máy khác',
        icon: BsCamera2
    }
]