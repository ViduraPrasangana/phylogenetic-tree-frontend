import React, { Component } from "react";
import {
  Row,
  Card,
  CardBody,
  Container,
  Button,
  Progress,
  FormInput,
  Col,
} from "shards-react";
import Files from "react-files";
import Axios from "axios";
import config from "../data/config";
import { connect } from "react-redux";

class GettingStarted extends Component {
  state = {
    selectedFiles: [],
    title: "",
  };
  onFilesChange = (files) => {
    this.setState({ selectedFiles: files });
  };

  onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  getUploadLink = (file) => {
    const { user } = this.props.user;
    console.log(file);
    Axios.post(
      config.host_url + "dnaStorage/upload/",
      {
        object_key: file.name,
        file_name: file.name,
        size: parseInt(file.size / 1024),
      },
      { headers: { Authorization: "Token " + user.token } }
    )
      .then((res) => this.uploadFile(res, file))
      .catch((err) => {
        console.log(err.response);
        file.error = err.response?.data?.file_name[0];
        this.forceUpdate();
      });
  };
  uploadFile(res, file) {
    console.log(res);
    Axios.put(res.data.url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progress) => {
        file.progress = (progress.loaded * 100) / progress.total;
        this.forceUpdate();
      },
    })
      .then((res) => {
        file.uploaded = true;
        this.forceUpdate();
        this.notifyDatabase(file, 1);
      })
      .catch((err) => {
        console.log(err.response);
        this.notifyDatabase(file, 0);
      });
  }

  notifyDatabase(file, state) {
    const { user } = this.props.user;
    Axios.post(
      config.host_url + "dnaStorage/updateStatus/",
      {
        file_name: file.name,
        is_uploaded: state,
      },
      { headers: { Authorization: "Token " + user.token } }
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err.response));
  }

  render() {
    const { selectedFiles, title } = this.state;
    return (
      <Container fluid>
        <Row className="justify-content-center mt-3">
          <Card style={{ width: "80%" }}>
            <CardBody>
              <Row className="mb-3">
                <Col className="d-flex justify-content-end align-content-center text-semibold">
                  <h5 className="mb-0">Choose a title for Visualization</h5>
                </Col>
                <Col className="d-flex justify-content-start">
                  <FormInput
                    onChange={(e) =>
                      this.setState({
                        title: e.target.value,
                      })
                    }
                    style={{ width: "80%" }}
                    value={title}
                  />
                </Col>
              </Row>

              <div
                className=""
                style={{
                  borderStyle: "dashed solid",
                  borderRadius: 20,
                  borderWidth: 2,
                }}
              >
                <Files
                  className="files-dropzone  d-flex align-items-center justify-content-center"
                  onChange={this.onFilesChange}
                  onError={this.onFilesError}
                  accepts={["image/png", ".fna", "audio/*"]}
                  multiple
                  maxFiles={100}
                  maxFileSize={20000000} //1000=1kb
                  minFileSize={0}
                  clickable
                  style={{ height: 100, width: "100%" }}
                >
                  Drop files here or click to upload
                </Files>
              </div>
            </CardBody>
          </Card>
        </Row>
        {selectedFiles.length && (
          <Row
            className="justify-content-center mt-3 "
            style={{ height: "150%" }}
          >
            <Card
              className="overflow-scroll"
              style={{ maxHeight: "30%", width: "80%" }}
            >
              <CardBody>
                {selectedFiles.map((element, index) => {
                  const { uploaded, error } = element;
                  return (
                    <Card
                      className="mb-2 d-flex justify-content-center px-3 pt-3"
                      key={index}
                    >
                      <Row className="justify-content-between px-4">
                        <label className="m-0">{element.name}</label>
                        <Button
                          onClick={() => this.getUploadLink(element)}
                          disabled={uploaded || error}
                          theme={error ? "danger" : "primary"}
                        >
                          {uploaded && "Uploaded"}
                          {!uploaded && !error && "Upload"}
                          {error && error}
                        </Button>
                      </Row>
                      <Row className="px-3 mt-2">
                        <Progress
                          theme="success"
                          style={{ height: "5px", width: "100%" }}
                          className="mb-3"
                          value={element.progress ? element.progress : 0}
                        />
                      </Row>
                    </Card>
                  );
                })}
              </CardBody>
            </Card>
          </Row>)}
          <Row className="d-flex justify-content-center" >
          <Button theme="info" style={{width:"60%",height:50,fontSize:20}}>Generate Distance Matrix</Button>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};
// const mapDispatchToProps = dispatch => {
//   return {
//     register: (user) => {
//       dispatch(UserActions.register(user));
//     }
//   };
// };

export default connect(mapStateToProps)(GettingStarted);
