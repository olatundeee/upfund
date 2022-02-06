import {React, useCallback, useState, useMemo, useEffect} from "react";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed} from '@hiveio/keychain'
import SimpleMdeReact from "react-simplemde-editor";

// components


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

//let inscrybmde = new InscrybMDE()


const author = getUrlParameter('user')

function New() {
    let [value, setValue] = useState("");

    const autofocusNoSpellcheckerOptions = useMemo(() => {
        return  {
          hideIcons: ['preview', 'side-by-side'],
          previewImagesInEditor: true,
          promptURLs: true
        };
    }, []);
   
    async function handlePostSubmit() {
        const title = document.getElementById('postTitle').value
        const body = value
        console.log(title, body)
    }

    return (
        <div className="post-detail" id="post-page-content">
            <div className="row">
                <div className="col-lg-2"></div>
                <div className="col-lg-8 col-sm-12 container" key={author} data-author={author}>
                    <div className="container mb-3 text-cont">
                        <label htmlFor="postTitle" className="form-label text-left">Title</label>
                        <input type="text" className="form-control" id="postTitle" placeholder="Enter a Title for Your Post Here" />
                    </div>

                    <div className="container mb-3 encloseEditor">
                        <label htmlFor="postEditor" className="form-label">Description</label>
                        <SimpleMdeReact value={value} onChange={(value) => {
                            setValue(value)
                        }} options={autofocusNoSpellcheckerOptions} style={{textAlign: 'left'}} />
                    </div>

                    <div className="container mb-3 text-right">
                        <a className="btn btn-primary" id="submitPost" onClick={() => {
                            handlePostSubmit()
                        }}>Submit</a>
                    </div>
                </div>
                <div className="col-lg-2"></div>
                <hr />
                <br />
                <br />
                <br />
                <br />
            </div>
        </div>
    );
}

export default New;