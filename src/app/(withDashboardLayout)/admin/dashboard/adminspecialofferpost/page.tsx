"use client";

import { useState } from "react";
import axios from "axios";

export default function SpecialOfferAdmin() {
  const [hero, setHero] = useState({ title: "", subtitle: "", image: "" });
  const [offers, setOffers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE UPLOAD ================= */
  const uploadToImgbb = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
      fd
    );
    return res.data.data.url;
  };

  /* ================= LOAD EXISTING DATA ================= */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/special-section");
      if (res.data) {
        setHero(res.data.hero || { title: "", subtitle: "", image: "" });
        setOffers(res.data.offers || []);
        setPackages(res.data.packages || []);
        setEditMode(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error loading data ❌");
    }
    setLoading(false);
  };

  /* ================= SAVE ALL ================= */
  const saveAll = async () => {
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/special-section", {
        hero,
        offers,
        packages,
      });
      alert("Saved Successfully ✅");
      setEditMode(true);
    } catch (err) {
      console.error(err);
      alert("Error saving data ❌");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 text-black">
      {/* ===== LOAD/EDIT BUTTON ===== */}
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={loadData}
        >
          {loading ? "Loading..." : editMode ? "Edit Section" : "Edit"}
        </button>
      </div>

      {/* ===== HERO ===== */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-xl font-bold">Hero Section</h2>
        <input
          className="input"
          placeholder="Title"
          value={hero.title}
          onChange={e => setHero({ ...hero, title: e.target.value })}
        />
        <input
          className="input"
          placeholder="Subtitle"
          value={hero.subtitle}
          onChange={e => setHero({ ...hero, subtitle: e.target.value })}
        />
        <input
          type="file"
          className="input"
          onChange={async e => {
            if (!e.target.files) return;
            const url = await uploadToImgbb(e.target.files[0]);
            setHero({ ...hero, image: url });
          }}
        />
        {hero.image && <img src={hero.image} className="w-40 h-24 object-cover rounded" />}
      </div>

      {/* ===== OFFERS ===== */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-xl font-bold">Offers</h2>
        {offers.map((o, i) => (
          <OfferItem
            key={i}
            data={o}
            upload={uploadToImgbb}
            onEdit={updated => {
              const copy = [...offers];
              copy[i] = updated;
              setOffers(copy);
            }}
          />
        ))}
        <OfferForm onAdd={o => setOffers([...offers, o])} upload={uploadToImgbb} />
      </div>

      {/* ===== PACKAGES ===== */}
      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <h2 className="text-xl font-bold">Packages</h2>
        {packages.map((p, i) => (
          <PackageItem
            key={i}
            data={p}
            upload={uploadToImgbb}
            onEdit={updated => {
              const copy = [...packages];
              copy[i] = updated;
              setPackages(copy);
            }}
          />
        ))}
        <PackageForm onAdd={p => setPackages([...packages, p])} upload={uploadToImgbb} />
      </div>

      <button
        type="button"
        onClick={saveAll}
        className="bg-[#bea64c] text-white px-6 py-3 rounded-full mt-4"
      >
        Save Whole Section
      </button>
    </div>
  );
}

/* ===== OFFER FORM ===== */
function OfferForm({ onAdd, upload }: any) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");

  const add = () => {
    if (!title) return alert("Title required");
    onAdd({ title, desc, img });
    setTitle("");
    setDesc("");
    setImg("");
  };

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input className="input" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input type="file" className="input" onChange={async e => {
        if (!e.target.files) return;
        const url = await upload(e.target.files[0]);
        setImg(url);
      }} />
      {img && <img src={img} className="w-32 h-20 object-cover rounded" />}
      <button type="button" onClick={add} className="btn">Add Offer</button>
    </div>
  );
}

/* ===== PACKAGE FORM ===== */
function PackageForm({ onAdd, upload }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [img, setImg] = useState("");

  const add = () => {
    if (!name) return alert("Name required");
    onAdd({ name, price, img, features: features.split(",").map(f => f.trim()).filter(Boolean) });
    setName("");
    setPrice("");
    setFeatures("");
    setImg("");
  };

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="input" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <input className="input" placeholder="Features (comma separated)" value={features} onChange={e => setFeatures(e.target.value)} />
      <input type="file" className="input" onChange={async e => {
        if (!e.target.files) return;
        const url = await upload(e.target.files[0]);
        setImg(url);
      }} />
      {img && <img src={img} className="w-32 h-20 object-cover rounded" />}
      <button type="button" onClick={add} className="btn">Add Package</button>
    </div>
  );
}

/* ===== OFFER ITEM ===== */
function OfferItem({ data, onEdit, upload }: any) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [desc, setDesc] = useState(data.desc);
  const [img, setImg] = useState(data.img);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await upload(e.target.files[0]);
    setImg(url);
  };

  return (
    <div className="border p-2 rounded flex flex-col md:flex-row items-start md:items-center justify-between mt-2 space-y-2 md:space-y-0">
      <div className="flex flex-col flex-1 space-y-1">
        {edit ? (
          <>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input" value={desc} onChange={e => setDesc(e.target.value)} />
            <input type="file" className="input" onChange={handleFileChange} />
          </>
        ) : (
          <p className="font-semibold">{title}</p>
        )}
        {img && <img src={img} className="w-32 h-20 object-cover rounded" />}
      </div>
      <button
        type="button"
        className="ml-2 btn px-3 py-1 text-sm"
        onClick={() => {
          if (edit) onEdit({ title, desc, img });
          setEdit(!edit);
        }}
      >
        {edit ? "Save" : "Edit"}
      </button>
    </div>
  );
}

/* ===== PACKAGE ITEM ===== */
function PackageItem({ data, onEdit, upload }: any) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(data.name);
  const [price, setPrice] = useState(data.price);
  const [features, setFeatures] = useState(data.features.join(","));
  const [img, setImg] = useState(data.img);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await upload(e.target.files[0]);
    setImg(url);
  };

  return (
    <div className="border p-2 rounded flex flex-col md:flex-row items-start md:items-center justify-between mt-2 space-y-2 md:space-y-0">
      <div className="flex flex-col flex-1 space-y-1">
        {edit ? (
          <>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
            <input className="input" value={price} onChange={e => setPrice(e.target.value)} />
            <input className="input" value={features} onChange={e => setFeatures(e.target.value)} />
            <input type="file" className="input" onChange={handleFileChange} />
          </>
        ) : (
          <p className="font-semibold">{name} ({price})</p>
        )}
        {img && <img src={img} className="w-32 h-20 object-cover rounded" />}
      </div>
      <button
        type="button"
        className="ml-2 btn px-3 py-1 text-sm"
        onClick={() => {
          if (edit) onEdit({ name, price, img, features: features.split(",").map(f => f.trim()) });
          setEdit(!edit);
        }}
      >
        {edit ? "Save" : "Edit"}
      </button>
    </div>
  );
}
