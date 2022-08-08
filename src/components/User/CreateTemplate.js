import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import { Editor } from "react-draft-wysiwyg";
// import tinymce from "tinymce/tinymce";
// import "tinymce/plugins/code";
// import { Editor } from "@tinymce/tinymce-react";
// import createToolbarPlugin from "draft-js-static-toolbar-plugin";
// import { EditorState } from "draft-js";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { stateToHTML } from "draft-js-export-html";
import { toast } from "react-toastify";

// const staticToolbarPlugin = createToolbarPlugin();
// const { Toolbar } = staticToolbarPlugin;

const API_URL = process.env.REACT_APP_API_URL;

function CreateTemplate() {
  let history = useHistory();

  // const [editorState, setEditorState] = React.useState(() =>
  //   EditorState.createEmpty()
  // );

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.value);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    type: "rte",
    design: {}
  });
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  // const handleEditorChange = (value) => {
  //   // let html = stateToHTML(editorState.getCurrentContent());
  //   setFormData({ ...formData, content:  });
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let textareatContent = document.getElementById("rteEditor");

    // setFormData({ ...formData, content: editorRef.current.value });

    if (!editorRef.current.value) {
      return toast.error("Please fill all field, all are required");
    }

    let bodyData = {
      name: formData.name,
      subject: formData.subject,
      content: editorRef.current.value,
      type: "rte",
      design: formData.design
    };

    try {
      let url = `${API_URL}/api/user/template/create`;
      let createTemplate = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
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

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function loadTinyMce() {
    const res = await loadScript("/assets/plugins/tinymce/tinymce.min.js");

    if (!res) {
      alert("TinyMce SDK failed to load.");
      return;
    }
    var s = document.createElement("script");
    s.type = "text/javascript";
    var code =
      'tinymce.init({ selector: "#rteEditor", plugins: [ "advlist", "lists", "autolink", "code" ], toolbar: "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link lists preview code | help", menubar: "edit view insert format tools", setup: function (editor) { editor.on("change", function () { editor.save() })} })';
    s.appendChild(document.createTextNode(code));
    document.body.appendChild(s);
  }

  const [sendEmailState, setSendEmailState] = useState(false);

  const testEmail = async () => {
    let textareatContent = document.getElementById("rteEditor");
    setFormData({ ...formData, content: textareatContent.value });
  };

  const sendEmail = async () => {
    if (!formData.subject) {
      return toast.error("Subject is required.");
    }

    if (!formData.content) {
      return toast.error("Template content is required.");
    }
    setTestEmailLoading(true);

    try {
      let url = `${API_URL}/api/user/template/test-email`;
      let testMail = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      let res = await testMail.json();
      if (res.status === "success") {
        toast.success(res.message);
      } else {
        toast.error(
          "Sorry cannot send email right now, please try again later"
        );
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later.");
    }
    setTestEmailLoading(false);
    setSendEmailState(false);
  };

  useEffect(() => {
    loadTinyMce();
  }, []);

  useEffect(() => {
    if (sendEmailState) {
      sendEmail();
    }
  }, [formData]);

  return (
    <>
      <div className="fullHeightWithNavBar p-4">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="cardTitle mb-3 d-flex justify-content-between align-items-center">
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
              <div className="d-flex justify-content-end mb-3">
                {/* <Link
                  to="/templates"
                  className="btn btn-sm btn-outline-secondary py-0"
                >
                  <i className="fas fa-chevron-left me-2"></i>Back to Template
                </Link> */}
                <div>
                  {/* <button
                    type="button"
                    className="btn btn-primary btn-sm py-0 me-2"
                    onClick={() => {
                      log();
                    }}
                  >
                    Log
                  </button> */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm py-0 me-2"
                  >
                    Save
                  </button>
                  <Link
                    to="/templates"
                    className="btn btn-danger btn-sm py-0 me-2"
                  >
                    Discard
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-success py-0"
                    onClick={() => {
                      setSendEmailState(true);
                      testEmail();
                    }}
                  >
                    {testEmailLoading && (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                      </>
                    )}
                    Send Test Email
                  </button>
                </div>
              </div>

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
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-label="Template Subject"
                  />
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Mapwords
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{FIRSTNAME}}"
                          });
                        }}
                      >
                        First Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{LASTNAME}}"
                          });
                        }}
                      >
                        Last Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{COMPANYNAME}}"
                          });
                        }}
                      >
                        Company Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{TITLE}}"
                          });
                        }}
                      >
                        Title
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Template Content
                </label>
                <div className="border rounded" style={{ minHeight: "400px" }}>
                  <textarea
                    id="rteEditor"
                    name="content"
                    onChange={handleChange}
                    ref={editorRef}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTemplate;
