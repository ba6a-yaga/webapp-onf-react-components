import React from "react"
import PropTypes from "prop-types"
class User extends React.Component {
  render () {
    return (
      <React.Fragment>
        Имя1: {this.props.data.name}
      </React.Fragment>
    );
  }
}

User.propTypes = {
  name: PropTypes.string
};
export default User
