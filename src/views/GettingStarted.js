import React, { Component } from "react";
import { Row, Card, CardBody, Container, Button, Progress } from "shards-react";
import Files from "react-files";

class GettingStarted extends Component {
  state = {
    selectedFiles: []
  };
  onFilesChange = files => {
    const { selectedFiles } = this.state;
    files.forEach(element => {
      console.log(element);
      selectedFiles.push(element);
    });
    this.setState({ selectedFiles });
  };

  onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  render() {
    const { selectedFiles } = this.state;
    return (
      <Container fluid >
        <Row className="justify-content-center mt-3">
          <Card style={{ width: "80%" }}>
            <CardBody>
              <div
                className=""
                style={{
                  borderStyle: "dashed solid",
                  borderRadius: 20,
                  borderWidth: 2
                }}
              >
                <Files
                  className="files-dropzone  d-flex align-items-center justify-content-center"
                  onChange={this.onFilesChange}
                  onError={this.onFilesError}
                  accepts={["image/png", ".pdf", "audio/*"]}
                  multiple
                  maxFiles={100}
                  maxFileSize={10000000}
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
          <Row className="justify-content-center mt-3">
            <Card style={{ width: "80%" }}>
              <CardBody>
                {selectedFiles.map((element, index) => {
                  return (
                    <Card className="mb-2 d-flex justify-content-center px-3 pt-3">
                      <Row className="justify-content-between px-4">
                        <label className="m-0">{element.name}</label>
                        <Button>Upload</Button>
                      </Row>
                      <Row className="px-3 mt-2">
                        <Progress
                          theme="success"
                          style={{ height: "5px",width:"100%" }}
                          className="mb-3"
                          value={40}
                        />
                      </Row>
                    </Card>
                  );
                })}
              </CardBody>
            </Card>
          </Row>
        )}
      </Container>
    );
  }
}

export default GettingStarted;
