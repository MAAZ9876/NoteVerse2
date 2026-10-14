import { UPLOAD_URL } from "../../requestMethods";
import React, { useContext, useRef } from "react";
import "./UpdatePost.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { publicRequest } from "../../requestMethods";
import {useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from '../Navbar'
function UpdatePost() {
  const { notesid } = useParams();
  const { currentUser: user } = useSelector((state) => state.user);
  const [notename, setnotename] = useState();
  const [desc, setdesc] = useState();
  const [noteupdatedphoto, setnoteupdatedphoto] = useState(null);
  const [noteupdatedfile, setnoteupdatedfile] = useState("");

  const navigate = useNavigate();

  const UpdateNoteHandler = async (e) => {
    e.preventDefault();
    // only send the fields the user actually filled in, so nothing gets wiped
    const newNote = { userId: user._id };
    if (notename) newNote.notename = notename;
    if (desc) newNote.desc = desc;
    if (noteupdatedfile) newNote.notefilename = noteupdatedfile;
    try {
      if (noteupdatedphoto) {
        const data = new FormData();
        data.append("file", noteupdatedphoto);
        const res = await axios.post(UPLOAD_URL, data);
        newNote.thumbnailfilename = res.data.url;
      }
      await publicRequest.put(`notes/${notesid}`, newNote);
      alert("Note updated successfully.");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Update failed. Please try again.");
    }
  };
  return (
    <>
    <Navbar />
      <div className="Update-post-container-complete">
        <div className="Update-post-container">
          <p className="Update-post-container-name">Update your note</p>
          <form
            onSubmit={UpdateNoteHandler}
            className="Update-post-container-form"
          >
            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Note name</p>
              <input
                type="text"
                placeholder="notename"
                onChange={(e) => setnotename(e.target.value)}
                className="Update-post-input-block"
              ></input>
            </div>

            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Descritpion</p>
              <input
                type="text"
                placeholder="Descritpion"
                onChange={(e) => setdesc(e.target.value)}
                className="Update-post-input-block"
              ></input>
            </div>

            <div className="Update-post-input-box">
              <p className="Update-post-input-heading">Note file Url</p>
              <input
                type="text"
                className="Update-post-input-block"
                placeholder="note file url(file must be in pdf format)"
                onChange={(e) => setnoteupdatedfile(e.target.value)}
              ></input>
            </div>

            <div className="Update-post-input-box-file">
              <p className="Update-post-input-heading-file">Thumbnail file</p>
              <input
                type="file"
                className="Update-post-input-block-file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setnoteupdatedphoto(e.target.files[0])}
              ></input>
            </div>
            <button type="submit" className="Update-post-container-form-submit">
              Update-Note
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatePost;
