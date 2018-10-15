import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String!
    $largeImage: String!
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "some tiiiitle",
    description: "beeg beeg title",
    image: "",
    largeImage: "",
    price: 435
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch("https://api.cloudinary.com/v1_1/slavalab/image/upload", {
      method: "POST",
      body: data
    });

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // Navigate to the item list page
              const response = await createItem();
              console.log(response);
              Router.push({
                pathname: "/item",
                query: {
                  id: response.data.createItem.id
                }
              });
            }}
          >
            <Error error={error} aria-busy={loading} />
            <fieldset disabled={loading}>
              <label htmlFor="file">
                Image:
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image..."
                  required
                  value={this.state.image}
                  onChange={this.uploadFile}
                />
              </label>

              <label htmlFor="title">
                Title:
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title..."
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="price">
                Title:
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price..."
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="description">
                Title:
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description..."
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
            </fieldset>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
