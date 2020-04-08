import React, { Component } from "react";
import {
  Col,
  Card,
  CardHeader,
} from "shards-react";
import { halfTrans, fullTrans,} from "../data/constants";
import { connect } from "react-redux";
import roles from "../data/roles";


class Samples extends Component {   
  render() {
    const { user} = this.props
    if (user.user && user.user.role===roles.customer) this.props.history.push("/")
    else if (user.user && user.user.role===roles.management) this.props.history.push("/admin/flights-today")
    return (
      <Card small className="mb-auto col-8" style={halfTrans}>
        <CardHeader className="border-bottom" style={fullTrans}>
          <h3 className="text-center text-white">Try with samples</h3>
        </CardHeader>
        <Col>
            <h4 className="text-center text-white">Result </h4>
            <table className="table table-secondary" style={{marginTop:20},{marginBottom: 50}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>                    
                        <th colSpan="1">Action</th>
                    </tr>                                    
                </thead>                                            
            </table>    

            <br>

            </br>

            <h4 className="text-center text-white">Selected </h4>
            <table className="table table-secondary" style={{marginTop:20},{marginBottom: 100}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th colSpan="1">Action</th>
                    </tr>                    
                </thead>                    
            </table>       
        </Col>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.customerReducer
  };
};

export default connect(mapStateToProps)(Samples);
