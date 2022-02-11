import React from "react";
import { Link } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

function CreateTemplate() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = () => {};

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
          <form>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template name
              </label>
              <input
                type="text"
                className="form-control"
                // value={userState.first_name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template Subject
              </label>
              <input
                type="text"
                className="form-control"
                // value={userState.first_name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Template Content
              </label>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                onChange={handleEditorChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplate;
