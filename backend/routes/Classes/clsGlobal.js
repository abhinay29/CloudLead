class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    let queryobj = { ...this.queryString };
    const excludefields = ["page", "sort", "limit"];
    excludefields.forEach((el) => delete queryobj[el]);

    let querystr = JSON.stringify(queryobj);
    querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(querystr));
    return this;
  }
  sorting() {
    if (this.query.sort) {
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort({ first_name: 1, last_name: 1 });
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    let newLimit;
    if (limit === 25 || limit === 50) {
      newLimit = limit;
    } else {
      newLimit = 25;
    }
    const skip = (page - 1) * newLimit;
    this.query = this.query.skip(skip).limit(newLimit);
    return this;
  }

  // distinct() {
  //   this.query = this.query.distinct('company_name');
  //   return this;
  // }

  // count() {
  //   this.query = this.query.count();
  //   return this;
  // }
}

class ConvertStringRegex {
  constructor(str) {
    this.str = str;
  }

  convertStr() {
    let convertedStr = "";
    for (var x = 0; x < this.str.length; x++) {
      if (x + 1 == this.str.length) {
        convertedStr += this.str[x];
      } else {
        convertedStr += this.str[x] + "|";
      }
    }
    return convertedStr;
  }
}

class Fields {
  constructor(field) {
    this.field = field;
  }

  create() {
    if (this.field instanceof Array) {
      if (this.field.length > 0) {
        let regex = new ConvertStringRegex(this.field).convertStr();
        return { $regex: regex, $options: "i" };
      } else {
        return "";
      }
    } else {
      return { $regex: this.field, $options: "i" };
    }
  }
}

class RoleFields {
  constructor(field) {
    this.field = field;
  }
  create() {
    let object = [];
    if (this.field instanceof Array) {
      this.field.map((fin) => {
        object.push(fin);
      });
    } else {
      object.push(this.field);
    }
    return object;
  }
}

module.exports = { Fields, ConvertStringRegex, RoleFields, APIfeatures };
