<template>
  <v-data-table
    :headers="headers"
    :items="articles"
    :search="search"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Notice</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Notice
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.subject"
                      label="Subject"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="editedItem.userid"
                      label="Author"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-textarea
                      v-model="editedItem.content"
                      label="Content"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialog2"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ noticeTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="detailItem.subject"
                      label="Subject"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="detailItem.userid"
                      label="Author"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-textarea
                      v-model="detailItem.content"
                      label="Content"
                    ></v-textarea>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="detailItem.regtime"
                      label="RegisterTime"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <v-text-field
                      v-model="detailItem.hit"
                      label="Hit"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[getitemcontrols()]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="getdetailItem(item.articleno)"
      >
        mdi-plus
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item.articleno)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        {{ item.content }}
      </td>
    </template>
    <template v-slot:no-data>
      there is no data
    </template>
  </v-data-table>
</template>

<script>
import http from "@/api/http";

  export default {
    data: () => ({
      dialog: false,
      dialog2: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          text: 'ArticleNo',
          align: 'start',
          sortable: false,
          value: 'articleno',
        },
        { text: 'Subject', value: 'subject' },
        { text: 'Author', value: 'userid' },
        { text: 'RegisterTime', value: 'regtime' },
        { text: 'Hit', value: 'hit' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      articles: [],
      editedIndex: -1,
      editedItem: {
        subject: '',
        userid: 'admin',
        content: '',
      },
      defaultItem: {
        subject: '',
        userid: 'admin',
        content: '',
      },
      detailItem: {
        articleno: 0,
        subject: '',
        userid: 'admin',
        content: '',
        regtime: '',
        hit: 0,
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Notice' : 'Edit Notice'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created () {
      http.get(`/board`).then(({ data }) => {
        this.articles = data;
      });
    },
    methods: {
      getdetailItem(articleno) {
        console.log("detail")
        http.get(`/board/${articleno}`).then(({ data }) => {
          this.detailItem.articleno= data.articleno;
          this.detailItem.subject= data.subject;
          this.detailItem.userid= data.userid;
          this.detailItem.content= data.content;
          this.detailItem.regtime= data.regtime;
          this.detailItem.hit= data.hit;
        });
        this.dialog2 = true
      },
      handleClick(item) {
        this.userInfo = item;
      },
      getitemcontrols() {
        return `item.actions`;
      },
      editItem (item) {
        this.editedIndex = this.articles.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (articleno) {
        console.log(articleno)
        http.delete(`/board/${articleno}`).then(({ data }) => {
            let msg = data;
            alert(msg);
          });
        this.$router.go(this.$router.currentRoute)
      },
      deleteItemConfirm () {
        this.articles.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        http.get(`/board`).then(({ data }) => {
          this.articles = data;
        });
        this.editedItem = Object.assign({}, this.defaultItem)
        this.dialog2 = false
        this.dialog = false
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          http.put(`/board`, this.editedItem).then(({ data }) => {
            let msg = data;
            alert(msg);
          });
          this.close()
        } else {
          http.post(`/board`, this.editedItem).then(({ data }) => {
            let msg = data;
            alert(msg);
          });
        }
        this.close()
      },
    },
  }
</script>
<style scope>
.hide-scrollbar textarea {overflow-y:hidden} 
</style>