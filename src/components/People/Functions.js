export const handleSelectChange = (e) => {
  // let first_name = []
  // e.map(v => {
  //   first_name.push(v);
  // })
  // setDefaultValue({ ...defaultValue, first_name: first_name })
  console.log(e)
}

export const onSelectSavedSearch = async (e, defaultValue, setDefaultValue) => {
  const savedSearches = await JSON.parse(localStorage.getItem("savedSearches"));
  savedSearches.map(svd => {
    if (svd._id === e.value) {

      let first_name = []
      if (svd.query['first_name[]'] !== "") {
        if (svd.query['first_name[]'] instanceof Array) {
          svd.query['first_name[]'].map(v => {
            first_name.push({ value: v, label: v })
          })
        } else {
          first_name = [{ value: svd.query['first_name[]'], label: svd.query['first_name[]'] }]
        }
      }

      let last_name = []
      if (svd.query['last_name[]'] !== "") {
        if (svd.query['last_name[]'] instanceof Array) {
          svd.query['last_name[]'].map(v => {
            last_name.push({ value: v, label: v })
          })
        } else {
          last_name = [{ value: svd.query['last_name[]'], label: svd.query['last_name[]'] }]
        }
      }

      setDefaultValue({
        ...defaultValue,
        first_name: first_name,
        last_name: last_name,
      })

    }
  })
}