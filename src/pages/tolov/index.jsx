import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [time, setTime] = useState(15 * 60); // 15 daqiqalik taymer
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fayl yuklash parametrlari
  const props = {
    onRemove: (file) => {
      const index = fileList.findIndex((item) => item.uid === file.uid);
      if (index !== -1) {
        const newFileList = [...fileList];
        newFileList.splice(index, 1);
        setFileList(newFileList);
      }
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Faylni avtomatik yuklashni to‘xtatadi
    },
    fileList,
  };

  // Taymerni boshqarish
  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      message.warning("Vaqt tugadi! Iltimos, qayta urinib ko‘ring.");
    }
  }, [time]);

  // Taymerni formatlash
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Karta raqamini nusxalash
  const copyText = () => {
    const text = "5614 6819 1836 7438";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Karta raqami nusxalandi: 5614 6819 1836 7438");
      })
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Karta raqami nusxalandi: 5614 6819 1836 7438");
      });
  };

  // Formani yuborish
  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("FullName", values.FullName);
    formData.append("Phone", values.Phone);
    formData.append("Image", fileList[0]?.originFileObj);

    fetch("https://script.google.com/macros/s/AKfycby7PkQZGCiT2YDtoFzWc2sDfM1RV-Dgnt4BF-pD62MmPWWnewxgZoooS1ignNYkQ4ht/exec", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          navigate("/tg-taklif");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Yuborildi:", data);
      })
      .catch((err) => {
        console.error("Hatolik:", err);
      });
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
                <Button className="bg-transparent" icon={<CopyOutlined />} onClick={copyText} />
              </div>
              <p className="text-[18px]">Alijonova Dilshodaxon</p>
            </div>

            <Form onFinish={handleSubmit} autoComplete="off" layout="vertical" className="pt-4">
              <Form.Item
                name="FullName"
                rules={[
                  {
                    required: true,
                    message: "Siz ism yo'lagini to'ldirmadingiz!",
                  },
                ]}
              >
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
              <Form.Item
                name="Phone"
                rules={[
                  {
                    required: true,
                    message: "Siz telifon raqamingizni kiritmadingiz!",
                  },
                ]}
              >
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
              <Form.Item
                name="Image"
                rules={[
                  {
                    required: true,
                    message: "Siz cheak rasmini kiritmadingiz!",
                  },
                ]}
              >
                <Upload {...props} maxCount={1}>
                  <Button type="dashed" style={{ width: "100%" }}>
                    Upload File
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
