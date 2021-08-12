import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { CREATE_USER, SubQuery } from './graph-ql-queries/gql.query';
import { GraphQlService } from './services/graph-ql.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Graph-Ql-subscription';
  users: any[] | undefined;
  liveData: any | undefined;
  loading = true;
  error: any;
  newChat: any = [];

  private querySubscription: Subscription = new Subscription;

  constructor(private graphQlService: GraphQlService, private apollo: Apollo) { }

  ngOnInit() {
    this.fetchGraphQl();
    this.subscribeToUser();
  }

  fetchGraphQl() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: gql`
      {
        users {
          firstName
          lastName
          age
        }
      }
    `,
      })
      .valueChanges.subscribe((result: any) => {
        this.users = result?.data?.users;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  mutateUser() {
    this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        "createUserAge": 19,
        "createUserFirstName": "First Name",
        "createUserLastName": "Last name and created at " + new Date(),
      }
    }).subscribe(({ data }) => {
      console.log('data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  subscribeToUser() {
    this.apollo
      .watchQuery({
        query: gql`
        {
          users {
            firstName
            lastName
            age
          }
        }
      `,
      })
      .subscribeToMore({
        document: SubQuery,
        updateQuery: (prev, { subscriptionData }) => {
          this.liveData = subscriptionData.data
          console.log(this.liveData);
          const obj = {
            "name": this.liveData.subscribeUserCreation.firstName,
            "lastname": this.liveData.subscribeUserCreation.lastName,
            "age": this.liveData.subscribeUserCreation.age
          }
          this.newChat.push(obj);
        }
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
