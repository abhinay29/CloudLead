import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

function CreateTemplate() {
  let history = useHistory();

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: ""
  });

  const handleEditorChange = () => {
    let html = stateToHTML(editorState.getCurrentContent());
    setFormData({ ...formData, content: html });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content) {
      return toast.error("Please fill all field, all are required");
    }

    try {
      let url = `${API_URL}/api/user/template/create`;
      let createTemplate = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      let res = await createTemplate.json();
      if (res.status === "success") {
        toast.success(res.message);
        history.push("/templates");
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="fullHeightWithNavBar p-4">
      <div className="card">
        <div className="card-body">
          <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
            <h5>Create Template</h5>
            <div>
              <Link to="/templates" className="btn btn-sm btn-primary me-2">
                Templates
              </Link>
              <Link to="/sequences" className="btn btn-sm btn-primary">
                Sequences
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template Subject
              </label>
              <input
                type="text"
                className="form-control"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template Content
              </label>
              <div className="border rounded" style={{ minHeight: "400px" }}>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary me-2">
              Save
            </button>
            <Link to="/templates" className="btn btn-danger">
              Discard
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplate;
