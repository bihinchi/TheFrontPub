<script>
  const publish = () => {}
</script>


<form action="#" on:submit={publish}>
  <div class="form-group">
    <h4 for="candidatesSelect">Publish new advertisement:</h4>
    <label for="adlink">Advertisement link:</label>
    <input id="adlink"  type="url" class="form-control"/>
    <label for="addescription">Advertisement description:</label>
    <textarea id="addescription"  class="form-control"></textarea>
    <label for="advalue">Bet value:</label>
    <input id="advalue"  type="number" class="form-control" value="0.001" min="0.001" step="0.0015"/>
  </div>
  <button type="submit" class="btn btn-primary">Publish</button>
  <hr />
</form>
<p id="accountAddress" class="text-center"></p>


