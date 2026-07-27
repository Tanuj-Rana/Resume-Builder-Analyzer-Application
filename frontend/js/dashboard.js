function part2SwitchView(viewType) {
      const gridWrapper = document.getElementById('part2-grid-wrapper');
      const listWrapper = document.getElementById('part2-list-wrapper');
      const gridBtn = document.getElementById('part2-grid-view-btn');
      const listBtn = document.getElementById('part2-list-view-btn');

      if (viewType === 'grid') {
        gridWrapper.classList.remove('part2-hidden');
        listWrapper.classList.add('part2-hidden');
        gridBtn.classList.add('part2-active');
        listBtn.classList.remove('part2-active');
      } else {
        listWrapper.classList.remove('part2-hidden');
        gridWrapper.classList.add('part2-hidden');
        listBtn.classList.add('part2-active');
        gridBtn.classList.remove('part2-active');
      }
    }
