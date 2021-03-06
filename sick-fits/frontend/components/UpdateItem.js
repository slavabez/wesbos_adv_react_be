import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String!
    $largeImage: String!
  ) {
    updateItem(
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

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {(data, loading) => {
          if (loading) return <p>Loading...</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
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
                    <label htmlFor="title">
                      Title:
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title..."
                        required
                        defaultValue={this.state.title}
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
                        defaultValue={this.state.price}
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
                        defaultValue={this.state.description}
                        onChange={this.handleChange}
                      />
                    </label>
                  </fieldset>
                  <button type="submit">Submit</button>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
