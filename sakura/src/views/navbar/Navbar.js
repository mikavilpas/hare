import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { Link } from "react-router-dom";

const CoolNavbar = ({ children }) => {
  return (
    <div className="mt-3 d-flex">
      <div className="col pl-1">{children}</div>
      <DropdownButton
        as={ButtonGroup}
        id="nav-menu"
        variant="secondary"
        title={<i className="bi bi-list"></i>}
      >
        <Dropdown.Item as={Link} to="/">
          Dictionary
        </Dropdown.Item>
        <Dropdown.Item as={Link} to={"/settings"}>
          Settings
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default CoolNavbar;
