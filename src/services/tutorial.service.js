import http from "../http-common";
import axios from "axios";

class TutorialDataService {
  getAll(params) {

    var string_json = http.get("/tutorials", params);
    console.log("res list", string_json)
    return string_json;
  }

  get(id) {
    var r = http.options(`/tutorials/${id}`);
    
    //r.header('Access-Control-Allow-Origin', '*');
    console.log("res option", r)
    var res = http.get(`/tutorials/${id}`);
    console.log(res)
    return http.get(`/tutorials/${id}`);
  }

  create(data) {
    return http.post("/tutorials", data);
  }

  update(id, data) {
    return http.put(`/tutorials/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tutorials/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
}

export default new TutorialDataService();