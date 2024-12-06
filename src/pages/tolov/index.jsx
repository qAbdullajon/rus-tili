import { CopyOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [time, setTime] = useState(15 * 60); // 15 daqiqalik taymer
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  // Faylni o'zgartirishda boshqarish
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Formani yuborish
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("Name", values.name); // Form'dan kelgan qiymatlar
    formData.append("Phone", values.phone);
    formData.append("image", fileList[0]?.originFileObj); // Faylni `originFileObj` orqali olish

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbz-uYaJqWKGRCdzIA4Yg8F8fJKKXtzGkasVWD5oCkMonW_hmEKTQdkVkCMfD0LJgkBX/exec", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status === 200) {
        message.success("Ma'lumot muvaffaqiyatli yuborildi!");
      } else {
        message.error("Xato yuz berdi, qayta urinib ko'ring!");
      }
    } catch (error) {
      message.error("Server bilan aloqa muvaffaqiyatsiz!");
      console.error(error);
    }
  };

  // Taymerni boshqarish
  useEffect(() => {
    let isMounted = true; // Flag qo'shing
    if (time > 0) {
      const timerId = setInterval(() => {
        if (isMounted) {
          setTime((prevTime) => prevTime - 1);
        }
      }, 1000);
      return () => {
        isMounted = false; // Unmount bo'lganda flagni yangilang
        clearInterval(timerId);
      };
    } else if (isMounted) {
      message.warning("Vaqt tugadi! Iltimos, qayta urinib ko‘ring.");
      navigate("/timeout"); // Zarurat bo'lsa, kerakli sahifaga yo'naltirish
    }
  }, [time, navigate]);

  // Taymerni formatlash
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-full min-h-[100vh] flex justify-center">
      <div className="max-w-[436px] my-5 w-full flex flex-col gap-4">
        {/* Supper Rus tili */}
        <div className="bg-[#e2f0ff] rounded-[15px] py-5 px-[18px]">
          <h2 className="text-text text-[25px] font-semibold">SUPER RUS TILI</h2>
          <p className="text-[15px] text-text">Tarif: VIP</p>
          <p className="text-text text-[28px] pt-3 font-medium">47,000 so'm</p>
          <div className="flex justify-between">
            <p className="text-[14px] text-text">
              To'lov qilish muddati <br /> tugashiga oz qoldi!
            </p>
            <div className="text-xl bg-white py-2 px-4 rounded-xl text-[red]">{formatTime(time)}</div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-4 border border-[#e3e3e3] rounded-[20px]">
          <p className="text-xl">Quyidagi karta raqamiga to'lovni amalga oshiring va ism familiyangizni, telefon raqamingizni quyida qoldiring</p>
          <div>
            <div className="bg-[#ececec] flex flex-col gap-3 p-3 mt-7 rounded-[20px]">
              <div className="flex justify-between ">
                <p className="text-xl">PLASTIK KARTA</p>
                <p className="text-xl">47,000 so'm</p>
              </div>
              <div className="h-[1px] bg-[#c6c6c6]"></div>
              <div className="flex justify-between items-center">
                <p className="text-2xl textToCopy">5614 6819 1836 7438</p>
                <Button className="bg-transparent" icon={<CopyOutlined />} onClick={() => message.success("Karta raqami nusxalandi!")} />
              </div>
              <p className="text-[18px]">Alijonova Dilshodaxon</p>
            </div>

            <Form autoComplete="off" layout="vertical" className="pt-4" onFinish={handleSubmit}>
              <Form.Item name="name" rules={[{ required: true, message: "Siz ism yo'lagini to'ldirmadingiz!" }]}>
                <Input
                  placeholder="Ismingiz"
                  size="large"
                  style={{
                    height: "50px",
                    border: "1px solid rgb(105, 105, 105)",
                    fontSize: "18px",
                    paddingInline: "20px",
                  }}
                />
              </Form.Item>
              <Form.Item name="phone" rules={[{ required: true, message: "Siz telefon raqamingizni kiritmadingiz!" }]}>
                <Input
                  placeholder="+998 99 999 99 99"
                  size="large"
                  style={{
                    height: "50px",
                    border: "1px solid rgb(105, 105, 105)",
                    fontSize: "18px",
                    paddingInline: "20px",
                  }}
                />
              </Form.Item>

              <Form.Item name="image" rules={[{ required: true, message: "Siz chek rasmini kiritmadingiz!" }]}>
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  maxCount={1}
                  beforeUpload={() => false} // Fayl yuklashni avtomatik ravishda bloklash
                >
                  <Button type="dashed" style={{ width: "100%" }}>
                    Fayl yuklash
                  </Button>
                </Upload>
              </Form.Item>

              <Button htmlType="submit" className="w-full h-[50px]" type="primary" size="large">
                Davom etish
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
