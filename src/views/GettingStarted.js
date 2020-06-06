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
  FormRadio,
  Alert,
} from "shards-react";
import Files from "react-files";
import Axios from "axios";
import config from "../data/config";
import { connect } from "react-redux";

class GettingStarted extends Component {
  state = {
    selectedFiles: [],
    title: "",
    uploadedList: [],
    method: null,
    error: null,
    startState:false,
  };
  onFilesChange = (files) => {
    var newFiles = []
    files.forEach(file => {
      var new_file = new File([file], file.name.split(" ").join("_"));
      newFiles.push(new_file)
    });
    this.setState({ selectedFiles: newFiles });
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
        file_name: file.name.substring(0, file.name.length - 4),
        size: parseInt(file.size / (1024*1024)),
      },
      { headers: { Authorization: "Token " + user.token } }
    )
      .then((res) => this.uploadFile(res, file))
      .catch((err) => {
        console.log(err.response);
        file.error = err.response?.data?.non_field_errors
          ? err.response.data.non_field_errors[0]
          : "Something went wrong";
        if ("This file already in the Storage." === file.error) {
          const { uploadedList } = this.state;
          uploadedList.push(file.name.substring(0, file.name.length - 4));
          this.setState({ uploadedList });
        }
        this.forceUpdate();
      });
  };
  uploadFile(res, file) {
    console.log(file);
    delete Axios.defaults.headers["Authorization"]
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
        this.notifyDatabase(file, true);
      })
      .catch((err) => {
        console.log(err.response);
        this.notifyDatabase(file, false);
      });
      Axios.defaults.headers["Authorization"] ="Token " +this.props.user.user.token
  }

  notifyDatabase(file, state) {
    const { user } = this.props.user;
    Axios.post(config.host_url + "dnaStorage/updateStatus/", {
      file_name: file.name.substring(0, file.name.length - 4),
      is_uploaded: state,
    })
      .then((res) => {
        const { uploadedList } = this.state;
        uploadedList.push(file.name.substring(0, file.name.length - 4));
        this.setState({ uploadedList });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  validate = () => {
    const { uploadedList, title, method } = this.state;
    if (uploadedList.length > 0 && title && title.length > 0 && method) {
      this.setState({
        error:null
      })
      return true;
    } else {
      this.setState({
        error:"Fill all sections"
      })
      return false;
    }
  };

  startProcess = () => {
    if (this.validate()) {
      this.setState({
        startState:true,
        error:null
      })
      const { title, uploadedList,method } = this.state;
      Axios.post(config.host_url + "cluster/matrix/generate/", {
        title,
        file_names: uploadedList,
        is_default_user:false,
        type:method,
      })
        .then((res) => {
          this.setState({
            startState:false,
            error:null
          })
          this.props.history.push("/matrix/"+res.data.process.process_id)
          console.log(res);
        })
        .catch((err) => {
          this.setState({
            error:"Something went wrong",
            startState:false,
          })
          console.log(err.response);
          alert(err.response);
        });
    }
  };

  render() {
    const { selectedFiles, title, method, uploadedList, error,startState } = this.state;
    const { user } = this.props
    return (
      <Container
        fluid
        className="overflow-scroll pb-4"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center mt-3 ">
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
                  accepts={[".fna"]}
                  multiple
                  maxFiles={100}
                  maxFileSize={20000000} 
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
          <Row className="justify-content-center my-3">
            <Card style={{ maxHeight: "30%", width: "80%" }}>
              <CardBody>
                {selectedFiles.map((element, index) => {
                  const { uploaded, error } = element;
                  return (
                    <Card
                      className="mb-2 d-flex justify-content-center px-3 pt-3"
                      key={index}
                    >
                      <Row className="justify-content-between px-4">
                        <label className="m-0">{element.name.split("_").join(" ")}</label>
                        <Button
                          onClick={() => this.getUploadLink(element)}
                          disabled={uploaded || error}
                          theme={error ? "danger" : "primary"}
                          id="upload_btn"
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
          </Row>
        )}
        <Row className="d-flex justify-content-center">
          <Card className="p-2 mb-3" style={{ width: "50%" }}>
            <Row className="d-flex justify-content-center">
              <FormRadio
                checked={method === "LSH"}
                onClick={() => this.setState({ method: "LSH" })}
              >
                LHS method
              </FormRadio>
              <div style={{ width: 20 }} />
              <FormRadio
                checked={method === "KMER"}
                onClick={() => this.setState({ method: "KMER" })}
              >
                K-Mer method
              </FormRadio>
            </Row>
          </Card>
        </Row>

        {error && (
          <Row className="d-flex justify-content-center">
            <Alert theme="danger" style={{ borderRadius: 5 }}>
              {error}
            </Alert>
          </Row>
        )}
        <Row className="d-flex justify-content-center">
          <Button
          id="start_btn"
            theme="info"
            style={{ width: "60%", height: 50, fontSize: 20 }}
            onClick={this.startProcess}
          >
            {startState?"Starting process":"Generate Distance Matrix"}
          </Button>
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

export default connect(mapStateToProps)(GettingStarted);
