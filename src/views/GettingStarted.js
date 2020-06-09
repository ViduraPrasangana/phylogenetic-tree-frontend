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
import YouTube from "react-youtube";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class GettingStarted extends Component {
  state = {
    expanded: false,
  };
  handleChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  render() {
    const { expanded } = this.state
    return (
      <Container
        fluid
        className="overflow-scroll pb-4"
        style={{ height: "100%" }}
      >
        <Row className="justify-content-center mt-3 ">
          <Card style={{ width: "90%" }}>
            <CardBody>
              <Row>
                <Col className="col-12 col-lg-6">
                  <YouTube
                    videoId="2R1bQ5xy-SY"
                    opts={{
                      height: "450",
                      width: "100%",
                    }}
                    onReady={this._onReady}
                  />
                </Col>
                <Col className="col-12 col-lg-6">
                  <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Phylogenetic Tree</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      Phylogenetic Tree is a tree structure of DNAs which shows the evolutionary relationship 
                      depending on their genetic distance. Genetic distance calculates the difference of two species 
                      in the ACTG level. With this tree it is possible to classify species and understand traits of new species.

                      <img
                        
                        src={require("../assets/images/phylogenetictree.png")}
                      />
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Our work Flow</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      <img
                      style={{ maxWidth: "550px" }}
                      src={require("../assets/images/workflow.png")}
                    />
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>What is LSH?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      Local sensitive hashing is one of the methods to generate the genetic distance matrix. 
                      Here the minhash value of each sequence is taken. 
                      The process is optimized by partitioning the DNA before hashing and generating hash objects concurrently. 
                      Finally the Jaccard similarity coefficient is used to decide the genetic distance .
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>What is KMer?</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      First we are  listing all distinct k-mers of each genome 
                      sequence to construct kmer forests for each of the sequences. 
                      For this purpose, we have used DSK (disk streaming of k-mers) k-mer counting software, 
                      which lists k-mers with considerable low memory and disk usage. 
                      Using algorithm 1 and algorithm 2 we have constructed the k-mer forest using k-mer lists from each species.
                      Iterating through all the kmers of the sequence the forest is constructed, 
                      which guarantees that there is a root to leaf pathway for each distinct k-mer where each tree in the forest is k-deep. 
                      In the k-mer forest, the maximum possible number of trees for nucleotide sequence is 4 with possible A,C,T and G roots. 
                      On the other hand, if we use protein sequences instead of DNA, the number of trees became 20 as there are In20 possible roots.
                      Using this approach it is feasible to convert hyge DNA sequence to simplified k-mer forest structure,
                      which is more forthright to compare. In figure 1, shows an example of constructing a k-mer forest for a given sequence.
                      <br></br>
                      <img
                        src={require("../assets/images/kmer.png")}
                      />
                      <br></br>
                      This is a method that based on tree pruning. 
                      In order to calculate the distance between two forrest, it has to detect the 
                      k-mers which are not common between the two DNA sequence. When comparing two trees, 
                      it has to scan level by level from root node to leaf node. If any mismatch node found in scanning, 
                      all the pathways aka k-mers are counted using recursive algorithm and added to the distance.
                      Because of not traversing to child nodes of a mismatched node, 
                      efficiency is drastically improved. Using another recursive algorithm, 
                      uncommon nodes in trees of two forests are found. 
                      If those nodes are not left one of above algorithms works and pruning occurs.
                      <br></br>
                      Below Figure shows an example of how pruning happens.
                      Node A (with parent C), which is indicated in Forest I is absent in Forest II. 
                      Thus, pruning occurs, and child count, 
                      which is equal to 5 is added to the distance without traversing in the circled subtree.
                      
                      <img
                        
                       src={require("../assets/images/forest.png")}
                     />

                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Minhashing</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      Minhashing is the major step of our approach which generate a signature 
                      for a given sequence by creating a minhash object which consist of minimum hash values. 
                      Within a minhash object it contains two arrays which are called hashvalue array and permutation array. 
                      Following Algorithm 1 shows the process of initiating a minhash object by initiating those arrays. 
                      Number of minimum hash values that need to be generated for sequence is denoted by the number of permutations. 
                      The permutation array is used as a parameter for random bijective permutation function which is used to 
                      update the minimum hash values. We take a mersenne prime as the upper margin of those random value. 
                      All the hash values in hashvalue array are set to maximum hash value.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel6'} onChange={this.handleChange('panel6')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Partitioning mechanism</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      we are introducing a partitioning mechanism to increase the accuracy of minhasing. 
                      Before calculating the minhash object for a given DNA sequence, 
                      we are dividing the DNA sequence into predefined number of partitions. 
                      Then each partition is minhashing by considering them as different sequences. 
                      After minhaashing all the partitions, we are getting set of minhash objects for single DNA sequence and 
                      each minhash object consists of constant number of minimum hash values. 
                      Because of the partitioning it is possible to achieve the approximate uniform diffusion of minimum hash values in the DNA sequence.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel7'} onChange={this.handleChange('panel7')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>K-Medoid</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      Here phylogenetic tree is constructed using K-Medoid algorithm.

                      In here, to construct the tree we are using a modified version of the k-medoid algorithm.
                      We are using 2 medoid to cluster where we use the calculated distance matrix obtained above. 
                      One distance represents a data point in the vector space. Randomly we select 2 medoids and cluster around them. 
                      Then this is recursively apply to each bucket/ cluster until there is only one data point to be clustered. 

                      <img
                        
                        src={require("../assets/images/kmedoid.png")}
                      />
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel expanded={expanded === 'panel8'} onChange={this.handleChange('panel8')}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Tree Updation stage</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                      we are using the calculated genetic distances  to construct phylogenetic trees using unsupervised 
                      machine learning method K-medoid clustering. we are presenting a numerical neural network to efficiently
                      update the phylogenetic tree by adding a new species to already constructed tree. 
                      This process does not require building the tree from the beginning in existing methods such as maximum parsimony.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Col>
              </Row>
            </CardBody>
          </Card>
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
