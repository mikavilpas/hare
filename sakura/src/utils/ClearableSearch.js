import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

const ClearableSearch = ({
  searchInputText,
  setSearchInputText,
  searchInputRef,
  placeholder = "",
  autoFocus = false,
  searchLoading,
}) => {
  const clearSearch = () => {
    setSearchInputText("");
    searchInputRef?.current?.focus();
  };

  return (
    <>
      <Form.Control
        size="lg"
        spellCheck={false}
        placeholder={placeholder}
        value={searchInputText}
        onChange={(e) => setSearchInputText(e.target.value)}
        className="form-control border-0 rounded-0 shadow-none"
        ref={searchInputRef}
        aria-label="Search"
        autoFocus={autoFocus}
      />
      {searchLoading && (
        <InputGroup.Append>
          <Button variant="light" block className="border-0 bg-white">
            <Spinner className="bg-white" animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Button>
        </InputGroup.Append>
      )}
      <InputGroup.Append>
        <Button
          hidden={searchInputText?.length === 0}
          block
          size="lg"
          variant="light"
          onClick={() => clearSearch()}
          className="border-0 rounded-0 bg-white shadow-none"
          aria-label="Clear the search"
        >
          <i className="bi bi-x-square text-muted"></i>
        </Button>
      </InputGroup.Append>
    </>
  );
};

export default ClearableSearch;
