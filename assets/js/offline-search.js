// DOCSY OFFLINE SEARCH
// Adapted from code by Matt Walters https://www.mattwalters.net/posts/2018-03-28-hugo-and-lunr/

import lunr from 'lunr'

(function ($) {
  'use strict';

  $(document).ready(function () {
    const $searchInput = $('.td-search input');
    //
    // Register handler
    //

    $searchInput.on('change', (event) => {
      render($(event.target));

      // Hide keyboard on mobile browser
      $searchInput.blur();
    });

      // Allow enter to be used to re-trigger search
    $searchInput.on('keydown', (event) => {
      if (event.key === 'Enter' || event.which === 13) {
      render($(event.target));

      // Hide keyboard on mobile browser
      $searchInput.blur();
      }
    });

    // Prevent reloading page by enter key on sidebar search.
    $searchInput.closest('form').on('submit', () => {
      return false;
    });

    //
    // Lunr
    //

    let idx = null; // Lunr index
    const resultDetails = new Map(); // Will hold the data for the search results (titles and summaries)

    // Set up for an Ajax call to request the JSON data file that is created by Hugo's build process
    $.ajax($searchInput.data('offline-search-index-json-src')).then((data) => {
      idx = lunr(function () {
        this.ref('ref');
        // If you added more searchable fields to the search index, list them here.
        // Here you can specify searchable fields to the search index - e.g. individual toxonomies for you project
        // With "boost" you can add weighting for specific (default weighting without boost: 1)
        this.field('author', { boost: 10 });
        this.field('title', { boost: 5 });
        this.field('categories', { boost: 3 });
        this.field('tags', { boost: 3 });
        // this.field('projects', { boost: 3 }); // example for an individual toxonomy called projects
        this.field('description', { boost: 2 });
        this.field('body');
        data.forEach((doc) => {
          this.add(doc);

          resultDetails.set(doc.ref, {
            title: doc.title,
            excerpt: doc.excerpt,
            body: doc.body,
            description: doc.description
          });
        });
      });

      $searchInput.trigger('change');
    });

    const render = ($targetSearchInput) => {
      //
      // Dispose existing popover
      //

      {
        let popover = bootstrap.Popover.getInstance($targetSearchInput[0]);
        if (popover !== null ) {
          popover.dispose();
        }
      }

      //
      // Search
      //

      if (idx === null) {
        return;
      }

      const searchQuery = $targetSearchInput.val();
      if (searchQuery === '') {
        return;
      }
      const results = idx
        .query((q) => {
          const tokens = lunr.tokenizer(searchQuery.toLowerCase());
          tokens.forEach((token) => {
            const queryString = token.toString();
            q.term(queryString, {
              boost: 100,
            });
            q.term(queryString, {
              wildcard:
                lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
              boost: 10,
            });
            q.term(queryString, {
              editDistance: 2,
            });
          });
        })
        .slice(0, $targetSearchInput.data('offline-search-max-results'));

      //
      // Make result html
      //

      const $html = $('<div>');

      $html.append(
        $('<div>')
          .css({
            display: 'flex',
            justifyContent: 'space-between',
          })
          .append(
            $('<span>').html('<h2>Search results</h2>').css({ fontWeight: 'bold' })
          )
          .append(
            $('<span>').addClass('td-offline-search-results__close-button btn')
          )
      );

      const $searchResultBody = $('<div>').css({
        maxHeight: `calc(100vh - ${
          $targetSearchInput.offset().top - $(window).scrollTop() + 180
        }px)`,
        overflowY: 'auto',
      });
      $html.append($searchResultBody);

      if (results.length === 0) {
        $searchResultBody.append(
          $('<p>').text(`No results found for query "${searchQuery}"`)
        );
      } else {
        results.forEach((r) => {
          const doc = resultDetails.get(r.ref);
          const href =
            $searchInput.data('offline-search-base-href') +
            r.ref.replace(/^\//, '');

          const $entry = $('<div>').addClass('mt-4');

          $entry.append(
            $('<small>').addClass('d-block text-body-secondary').text(r.ref)
          );

          $entry.append(
            $('<a>')
              .addClass('d-block')
              .css({
                fontSize: '1.2rem',
              })
              .attr('href', href)
              .text(doc.title)
          );

          // Customised search result highlighting and display
          if (doc.description){
          $entry.append($('<h5 class="text-muted">').text(doc.description));
          } else {
            $entry.append($('<h5 class="text-muted">').text(doc.excerpt));
          };
          const bodyText = doc.body.toLowerCase();
          const searchText = searchQuery.toLowerCase();
          if(bodyText.indexOf(searchText) > -1) {
            let searchHighlight = doc.body.slice(bodyText.indexOf(searchText) - 50, bodyText.indexOf(searchText) + 50).replace(/\n/g, '<br>');
            let searchTerm = doc.body.slice(bodyText.indexOf(searchText), bodyText.indexOf(searchText) + searchText.length);
            const searchBold = `<span class="search-term">${searchTerm}</span>`;
            const deleteIndex = searchHighlight.toLowerCase().indexOf(searchText);
            searchHighlight = searchHighlight.split("");
            searchHighlight.splice(deleteIndex, searchText.length, searchBold);
            searchHighlight = searchHighlight.join("");
            $entry.append($('<p class="search-highlight text-muted">').html(`${searchHighlight}...`));
            };
          $searchResultBody.append($entry);
        });
      }

      $targetSearchInput.one('shown.bs.popover', () => {
        $('.td-offline-search-results__close-button').on('click', () => {
          $targetSearchInput.val(searchQuery);
          $targetSearchInput.trigger('change');
          {
            let popover = bootstrap.Popover.getInstance($targetSearchInput[0]);
              popover.dispose();
          }
        });
      });

      const popover = new bootstrap.Popover($targetSearchInput, {
        content: $html[0],
        html: true,
        customClass: 'td-offline-search-results',
        placement: 'bottom',
      });
      popover.show();
    };
  });
})(jQuery);
